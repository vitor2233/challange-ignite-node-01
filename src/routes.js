import { Database } from './database.js';
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.js';
import { httpValidator } from './middlewares/http-validator.js';

const database = new Database()

function validateFields(res, title, description) {
    if (!title) {
        return httpValidator(res, 400, "Título inválido")
    }

    if (!description) {
        return httpValidator(res, 400, "Descrição inválida")
    }
}

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { search } = req.query

            const users = database.select("tasks", search ? {
                title: search,
                description: search
            } : null)

            return res.end(JSON.stringify(users))
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { title, description } = req.body

            validateFields(res, title, description)

            const task = {
                id: randomUUID(),
                title,
                description,
                completed_at: null,
                created_at: new Date(Date.now()),
                updated_at: new Date(Date.now()),
            }

            database.insert("tasks", task)

            return res
                .writeHead(201).end()
        }
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params
            const { title, description } = req.body

            if (!database.isIdValid('tasks', id)) {
                return httpValidator(res, 400, "ID inexistênte")
            }

            validateFields(res, title, description)

            database.update('tasks', id, { title, description })
            return res.writeHead(204).end()

        }
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/:id/complete'),
        handler: (req, res) => {
            const { id } = req.params

            if (!database.isIdValid('tasks', id)) {
                return httpValidator(res, 400, "ID inexistênte")
            }

            database.setCompleted('tasks', id)
            return res.writeHead(204).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handler: (req, res) => {
            const { id } = req.params

            if (!database.isIdValid('tasks', id)) {
                return httpValidator(res, 400, "ID inexistênte")
            }

            database.delete('tasks', id)
            return res.writeHead(204).end()
        }
    },

]
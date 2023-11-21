import { parse } from 'csv-parse';
import fs from 'node:fs';

const csvPath = new URL('tasks.csv', import.meta.url)

const csvParse = parse({
    delimiter: ',',
    fromLine: 2
});

const stream = fs.createReadStream(csvPath);

const linesParse = stream.pipe(csvParse);

for await (const line of linesParse) {
    const [title, description] = line
    fetch('http://localhost:3333/tasks', {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description: description
        })
    })
}
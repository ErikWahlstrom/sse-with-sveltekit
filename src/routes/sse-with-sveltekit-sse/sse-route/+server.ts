//make a post endpoint providing a sse stream that pumps out a number every second

import { produce } from "sveltekit-sse";

let emitter: any;

export const POST = async ({ request }) => {
    return produce(async function start({ emit }) {
        // Handle the connection closing
        const data = await request.formData();
        const param1 = data.get('first')?.toString() ?? "no value1";
        const param2 = data.get('second')?.toString() ?? "no value2";
        emitter = emit;

        sendEvent({ message: `Starting process with params: ${param1} ${param2}`, count: 0, status: 'starting' });

        await startLongRunningTask(param1, param2);

        sendEvent({ message: 'Process done', status: 'done' });
    }
    );

};

const sendEvent = (message: any) => {
    emitter('sse-message', `${JSON.stringify(message)}\n`);
}

const startLongRunningTask = async (param1: string, param2: string) => {
    const prom = new Promise((resolve, reject) => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (i === 9) {
                    resolve('done');
                }
                sendEvent({ message: `Params where: ${param1} ${param2}`, count: i, status: 'running' });
            }, i * 1000);
        }
    });
    await prom;
}



//make a post endpoint providing a sse stream that pumps out a number every second

export const POST = async ({ request }) => {
    const body = new ReadableStream({
        async start(controller) {
            // Handle the connection closing
            request.signal.addEventListener('abort', () => {
                controller.close();
            });

            const data = await request.formData();
            const param1 = data.get('first')?.toString() ?? "no value1";
            const param2 = data.get('second')?.toString() ?? "no value2";

            sendEvent(controller, { message: `Starting process with params: ${param1} ${param2}`, count: 0, status: 'starting' });

            await startLongRunningTask(param1, param2, controller);

            sendEvent(controller, { message: 'Process done', status: 'done' });
            controller.close();
        }
    });

    return new Response(body, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Cache-Control': 'no-cache',
        }
    });
};

const sendEvent = (controller: ReadableStreamDefaultController<any>, message: any) => {
    controller.enqueue(`${JSON.stringify(message)}\n`);
}

const startLongRunningTask = async (param1: string, param2: string, controller: ReadableStreamDefaultController<any>) => {
    const prom = new Promise((resolve, reject) => {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                if (i === 9) {
                    resolve('done');
                }
                sendEvent(controller, { message: `Params where: ${param1} ${param2}`, count: i, status: 'running' });
            }, i * 1000);
        }
    });
    await prom;
}



const { Client } = require('./index');
const qrCode = require('qrcode-terminal');
const SingletonEventEmitter = require('./src/eventEmitter');

const contacts = [];
const singletonEventEmitter = SingletonEventEmitter.getInstance();

const flow = [
    {
        name: 'Primeiro contato',
        ref: 'AA',
        initialFlowMessage: {
            ref: 'AB',
            content: 'Olá.',
        },
        flowMessage: [
            {
                ref: 'AB',
                delay: 0,
                contentType: 'media',
                urlFile:
                    'https://images-na.ssl-images-amazon.com/images/S/pv-target-images/d2242f0298c9db21e0198b3e6924434f8daa093e567986a24a9192971ab1fc8a._RI_V_TTW_.jpg',
                content: 'Olá, bom dia!!',
                nextRef: 'AX',
                response: [],
            },
            {
                ref: 'AX',
                delay: 0,
                contentType: 'media',
                urlFile:
                    'https://images-na.ssl-images-amazon.com/images/S/pv-target-images/d2242f0298c9db21e0198b3e6924434f8daa093e567986a24a9192971ab1fc8a._RI_V_TTW_.jpg',
                content: 'oia que lindo',
                nextRef: 'AQ',
                response: [],
            },
            {
                ref: 'AQ',
                delay: 0,
                contentType: 'message',
                content: 'Tudo bem?!',
                response: [
                    {
                        key: ['tudo'],
                        ref: 'AC',
                    },
                    {
                        key: ['não'],
                        ref: 'AD',
                    },
                ],
            },
            {
                ref: 'AC',
                delay: 0,
                contentType: 'message',
                content: 'Que bom!! Gostaria de tomar um café?',
                response: [
                    {
                        key: ['sim'],
                        ref: 'AG',
                    },
                    {
                        key: 'não',
                        ref: 'AF',
                    },
                ],
                defaultResponse:
                    'Resposta incorreta. Por favor digite \'Sim\' ou \'Não\'.',
            },
            {
                ref: 'AD',
                delay: 0,
                contentType: 'message',
                sequence: 'socorro',
                content: 'Fico triste por isso. Quer voltar ao incio?',
                response: [
                    {
                        key: ['sim'],
                        ref: 'AB',
                    },
                    {
                        key: 'não',
                        ref: 'AE',
                    },
                ],
                defaultResponse:
                    'Resposta incorreta. Por favor selecione \'sim\' ou \'não\'.',
            },
            {
                ref: 'AE',
                delay: 0,
                contentType: 'message',
                content: 'Até mais.',
                response: [],
                endsFlow: true,
            },
            {
                ref: 'AF',
                delay: 0,
                contentType: 'message',
                content: 'Acabou o café, até mais.',
                response: [],
                endsFlow: true,
            },
            {
                ref: 'AG',
                delay: 0,
                contentType: 'message',
                content: 'Que pena, acabou o café, até mais.',
                response: [],
                endsFlow: true,
            },
        ],
    },
];

const sessionId = 'jojo-id';

/* mongoose.connect('mongodb://localhost:27017/session').then(async () => { */
async function initialize(emitBrowserClose = true) {
    const client = new Client({
        flow,
        contacts,
        singletonEventEmitter,
        sessionId: sessionId,
        emitBrowserClose: emitBrowserClose ? undefined: 'notIssue',
        /* authStrategy: new RemoteAuth({
            clientId: sessionId,
            backupSyncIntervalMs: 300000,
            store: new MongoStore({ mongoose: mongoose }),
        }), */
        puppeteer: {
            headless: false,
            args: ['--no-sandbox', '--disable-gpu'],
        },
    });

    client.on('loading_screen', (percent, message) => {
        console.log('LOADING SCREEN', percent, message);
    });

    client.on('remote_session_saved', () => {
        console.log('foi jojobesssssss');
    });

    client.on('qr', (qr) => {
        // NOTE: This event will not be fired if a session is specified.
        console.log('QR RECEIVED', qr);
        qrCode.generate(qr, { small: true });
    });

    client.on('authenticated', () => {
        console.log('AUTHENTICATED');
    });

    client.on('auth_failure', (msg) => {
        // Fired if session restore was unsuccessful
        console.error('AUTHENTICATION FAILURE', msg);
    });

    client.on('ready', () => {
        console.log('READY');
    });

    client.on('message', async (msg) => {
        const contact = await msg.getContact();
        client.sendMessage(msg.from, msg.body, contact);
    });

    client.on('new_contact', async (contact) => {
        console.log('oia jojo', contact);
    });

    client.on('disconnected', (reason) => {
        console.log('Client was logged out', reason);
    });

    client.on(
        'add_contact_in_sequence',
        ({ contactId, sequenceName, sessionId }) => {
            console.log('oia jojo ', contactId, sequenceName, sessionId);
        }
    );

    client.on('browser_disconnected', async () => {
        await initialize(false);
    });

    await client.initialize();

    if (!emitBrowserClose) return;

    setTimeout(async () => {
        console.log('testando');
        await client.destroy();
        console.log('foi mi lorder');
    }, 80000);
}

initialize();
    
/* }); */


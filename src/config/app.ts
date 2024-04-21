const nodeEnv = process.env.NODE_ENV || 'development';
export let config: {
    apiUrl: string;
};

if (nodeEnv === 'development') {
    config = {
        apiUrl: 'https://observatorio-uss.azurewebsites.net/api',
    };
}

if (nodeEnv === 'production') {
    config = {
        apiUrl: 'https://observatory-uss.azurewebsites.net/api',
    };
}
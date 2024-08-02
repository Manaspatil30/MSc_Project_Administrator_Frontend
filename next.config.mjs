/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers(){
        return [
            {
              // Apply these headers to all routes
              source: '/:path*',
              headers: [
                {
                  key: 'Access-Control-Allow-Origin',
                  value: 'http://localhost:8080/', // Adjust the origin as needed
                },
                {
                  key: 'Access-Control-Allow-Methods',
                  value: 'GET, POST, PUT, DELETE, OPTIONS',
                },
                {
                  key: 'Access-Control-Allow-Headers',
                  value: 'X-Requested-With, Content-Type, Accept',
                },
              ],
            },
          ];
    },
    env : {
        baseUrl: 'http://localhost:8080/'
    }
};

export default nextConfig;

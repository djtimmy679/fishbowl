module.exports = {
    default: {
        "siteConfig": {
            "host": "localhost",
            "port": 3000,
            "baseUrl": "http://localhost:3000"
        },
        "cookieOptions": {
            "expireTime": "3600"
        }
    },
    server: {
        "siteConfig": {
            "host": "https://yearbook-signings.sites.tjhsst.edu",
            "port": 12638,
            "baseUrl": "https://yearbook-signings.sites.tjhsst.edu"
        },
        "cookieOptions": {
            "expireTime": "3600"
        }
    }
}

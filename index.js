const bns = require('bns')
const { wire, AuthServer } = bns
const handler = require('serve-handler')
const http = require('http')
const { readdirSync } = require('fs')

/// Auth DNS Server for the TLD
const server = new AuthServer({
  tcp: true,
  edns: true,
  dnssec: true
})

// Tell bns which zone we're serving.
// Change to your HSD name. Remember to
// add the . at the end
server.setOrigin('laboratory.')
server.setFile(__dirname + '/zonefile')
server.on('query', (req, res, rinfo) => {
  // Log all requests (dig format).
  console.log('Incoming request:')
  console.log(req.toString())
})
server.bind(53, '0.0.0.0')

//////////////////////////////////////////////////////////////////
/// Simple File server

const fileServer = http.createServer((request, response) => {
  console.log('Serving: ' + request.headers.host)
  let requestedSite = request.headers.host.split('.')[0]

  /// Check to see all folders you are serving
  const directories = readdirSync(__dirname + '/public', {
    withFileTypes: true
  })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

  if (!directories.includes(requestedSite)) {
    requestedSite = 'default'
  }

  return handler(request, response, {
    cleanUrls: true,
    public: `public/${requestedSite}`
  })
})

fileServer.listen(80, () => {
  console.log('Running at http://localhost:80')
})

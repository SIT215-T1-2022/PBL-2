import threading
import webbrowser
import BaseHTTPServer
import SimpleHTTPServer

PORT = 8080

class TestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
  """The test example handler."""
  def do_POST(self):
    """Handle a post request by returning the square of the number."""
    length = int(self.headers.getheader('content-length'))
    data_string = self.rfile.read(length)
    try:
      board_size = int(data_string)
    except:
      result = 'error'
    self.wfile.write(result)

# Start server
server_address = ("", PORT)
server = BaseHTTPServer.HTTPServer(server_address, TestHandler)
server.serve_forever()

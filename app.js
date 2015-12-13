/***********************************************************************************/
//libraries
var net = require('net');
var server; //se inicializa mas tarde
var serverDB = {
    clients: []
};
/***********************************************************************************/
var netConfig = {
    port: 15000, //puerto de escucha
    host: '192.168.0.100', //escucha solo en esta ip
};
/***********************************************************************************/
var app = ServidorNET(); // llama a la funcion que crea un servidor net

/**
 * Objeto que almacena la creacion del servidor NET : object
 * 
 */
function ServidorNET(){
    var server = net.createServer(function (socket) {    	
    	socket.name = socket.remoteAddress + ":" + socket.remotePort; // Identifica al cliente
    	serverDB.clients.push(socket);// Añade el cliente al array de clientes del objeto serverDB
    	
    	//Muestra la ip:puerto de todos los sockets en el array de clientes del objeto serverDB
    	

        LoginMessage(socket);
        
        ConnectedClients(socket);

	    console.log('\n______________________________\n Received command#> ');
    	socket.write('\n__________NETZULO.com__________\n Send command$> ');
    	//    socket.pipe(socket);

    	/**Eventos internos del servidor*******************************************/
    	socket.on('data', function (data) {
	        Broadcast(socket.name + "> " + data, socket);

        	socket.write('Send command#> ');
    	});
    	/*FUNCTIONs internas del servidor******************************************/
    	// Envia mensajes a todos los clientes
    	function Broadcast(message, sender) {
	        serverDB.clients.forEach(function (client) {
            	if (client === sender) return; // evita que el mensaje sea recibido por el cliente que lo envio
            	client.write(message); // escribe el mensaje enviado en el cliente
        	});
        	// Log it to the server output too
        	process.stdout.write(message); // escribe el message recibido en la consola del servidor
    	}
    });
    server.listen(netConfig.port, netConfig.host);
    
    /*
     * Escribe un mensaje de bienvenida en la consola del servidor y en la consola remota
     */
    function LoginMessage(socket) {
        var strConsole = [
            '-------------------------------------------------------------------',
            '----- Manager Connections -----------------------------------------',
            '-------------------------------------------------------------------',
            '---------------------- Ready to Chat! -----------------------------',
            '-------------------------------------------------------------------'
        ];
        console.log(strConsole.join('\n'));
        socket.write(strConsole.join('\n'));
    }

    function ConnectedClients(socket) { 
        for (client in serverDB.clients) {
            console.log("Conectado desde: "+socket.name + "\n");
        }
    }
}
/***********************************************************************************/
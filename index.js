var monitor = require('node-docker-monitor');

var routes = {}; // available routes
monitor({
    onContainerUp: function(containerInfo, docker) {
        if (containerInfo.Labels && containerInfo.Labels.api_route) {
            // register a new route if container has "api_route" label defined
            var container = docker.getContainer(containerInfo.Id);
            // get running container details
            container.inspect(function(err, containerDetails) {
                if (err) {
                    console.log('Error getting container details for: %j', containerInfo, err);
                } else {
                    try {
                        // prepare and register a new route
                        var route = {
                            apiRoute: containerInfo.Labels.api_route,
                            upstreamUrl: getUpstreamUrl(containerDetails)
                        };

                        routes[containerInfo.Id] = route;
                        console.log('Registered new api route: %j', route);
                    } catch (e) {
                        console.log('Error creating new api route for: %j', containerDetails, e);
                    }
                }
            });
        }
    },

    onContainerDown: function(container) {
        if (container.Labels && container.Labels.api_route) {
            // remove existing route when container goes down
            var route = routes[container.Id];
            if (route) {
                delete routes[container.Id];
                console.log('Removed api route: %j', route);
            }
        }
    }
});

// generate upstream url from containerDetails
function getUpstreamUrl(containerDetails) {
    var ports = containerDetails.NetworkSettings.Ports;
    for (id in ports) {
        if (ports.hasOwnProperty(id)) {
            return 'http://' + containerDetails.NetworkSettings.IPAddress + ':' + id.split('/')[0];
        }
    }
}
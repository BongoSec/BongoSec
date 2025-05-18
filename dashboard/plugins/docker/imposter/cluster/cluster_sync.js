
var storeBongosec = stores.open('storeBongosec');
var attemptRestart = storeBongosec.load('attempt');


if(attemptRestart < 5){
    storeBongosec.save('attempt', attemptRestart + 1);
    respond()
        .withStatusCode(200)
        .withFile('cluster/cluster_sync_no_sync.json')
} else {
    storeBongosec.save('attempt', 0);
    respond()
        .withStatusCode(200)
        .withFile('cluster/cluster_sync.json')
}

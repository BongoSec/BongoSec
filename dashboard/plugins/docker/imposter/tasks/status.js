var storeBongosec = stores.open('storeBongosec');
var attemptRestart = storeBongosec.load('attempt');

var taskStatus = context.request.queryParams.status;

if (!taskStatus) {
  respond().withStatusCode(200).withFile('tasks/status_in_progress_2.json');
}

if (attemptRestart < 5) {
  storeBongosec.save('attempt', attemptRestart + 1);

  if (taskStatus === 'In progress') {
    respond().withStatusCode(200).withFile('tasks/status_in_progress_2.json');
  }

  if (taskStatus === 'Done' || taskStatus === 'Failed') {
    respond().withStatusCode(200).withFile('tasks/empty.json');
  }
} else if (attemptRestart < 10) {
  storeBongosec.save('attempt', attemptRestart + 1);

  if (taskStatus === 'In progress') {
    respond().withStatusCode(200).withFile('tasks/status_in_progress_1.json');
  }

  if (taskStatus === 'Done') {
    respond().withStatusCode(200).withFile('tasks/status_done.json');
  }

  if (taskStatus === 'Failed') {
    respond().withStatusCode(200).withFile('tasks/empty.json');
  }
} else {
  if (taskStatus === 'In progress') {
    respond().withStatusCode(200).withFile('tasks/empty.json');
  }

  if (taskStatus === 'Done') {
    respond().withStatusCode(200).withFile('tasks/status_done.json');
  }

  if (taskStatus === 'Failed') {
    storeBongosec.save('attempt', 0);
    respond().withStatusCode(200).withFile('tasks/status_failed.json');
  }
}

let lifecycleEvent = process.env.npm_lifecycle_event.split('.')[1];

function targetOrder(lifecycleEvent='alpha') {
  let obj = {};
  obj.fileNam = lifecycleEvent;
  obj.apiRoot= lifecycleEvent+'-cms';
  obj.pcRoot= lifecycleEvent+'-www';
  if(lifecycleEvent === 'prod'){
    obj.apiRoot = "cms";
    obj.pcRoot = "www";
  }
  return obj;
}

module.exports = {
  NODE_ENV: '"production"',
  API_ROOT: `"https://${targetOrder(lifecycleEvent)['apiRoot']}.jintoushou.com/console"`,
  PC_ROOT:`"https://${targetOrder(lifecycleEvent)['pcRoot']}.jintoushou.com"`,
  FILE_NAME:targetOrder(lifecycleEvent)['fileNam']
};

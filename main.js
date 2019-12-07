const { app, Tray, Menu, BrowserWindow } = require('electron');
const path = require('path');
const activeWin = require('active-win');
const Store = require('electron-store');
const iconPath = path.join(__dirname, 'dist/procrastinationKitten/assets/icon.png');

const { ipcMain } = require('electron');

Menu.setApplicationMenu(null);

const store = new Store();

let appIcon = null;
let win = null;

let appsRunning;

ipcMain.on('getHours', e => {
  e.sender.send('updatedHours', appsRunning);
});

let today;

formatProcess = (rawProcess) => {
  let process = {};

  if(rawProcess.title.includes(' - ')) {
    const slice = rawProcess.title.split(' - ');

    process.name = slice[slice.length - 1];
    process.subType = [{
      name: slice[slice.length - 2],
      time: 0.05
    }];
  }else {
    process.name = rawProcess.title;
    process.subType = [{
      name: rawProcess.title,
      time: 0.05
    }];
  }

  return process;
}

processInformation = async () => {
  try {
    const process = formatProcess(await activeWin());

    const index = appsRunning[appsRunning.length-1].list.findIndex(e => e.name == process.name);

    if (index == -1) {
      appsRunning[appsRunning.length-1].list.push(process);
    } else {
      const subIndex = appsRunning[appsRunning.length-1].list[index].subType.findIndex(e => e.name == process.subType[0].name);

      if (subIndex == -1)
        appsRunning[appsRunning.length-1].list[index].subType.push({
          name: process.subType[0].name,
          time: 0.05
        });
      else
        appsRunning[appsRunning.length-1].list[index].subType[subIndex].time += 0.05;
    }

    store.set('hours', appsRunning);
  } catch(e) {
    console.log(e);
  }
}

function createWindow () {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: `${__dirname}/dist/procrastinationKitten/assets/icon.png`,
    webPreferences: {
      nodeIntegration: true
    },
  });

  win.loadURL(`file://${__dirname}/dist/procrastinationKitten/index.html`);
}

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('ready', () => {
  appIcon = new Tray(iconPath);

  appsRunning = store.get('hours') || [];

  setInterval(() => {
    const date = new Date();
    today = `${date.getFullYear()}-${date.getMonth()+1}-${(date.getDate() < 10 ? '0' + date.getDate() : date.getDate())}`;

    if (appsRunning.find(e => e.date == today) == null)
      appsRunning.push({
        date: today,
        list: []
      });

    processInformation();
  }, 5000);

  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Details',
      click: () => {
        createWindow();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit();
      }
    }
  ]);

  appIcon.setToolTip('Apenas um teste maroto');
  appIcon.setContextMenu(contextMenu);
});

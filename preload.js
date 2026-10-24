"use strict";
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('mpg',{onFrame:cb=>ipcRenderer.on('mpg:frame',(_,data)=>cb(data)),event:ev=>ipcRenderer.send('mpg:event',ev)});

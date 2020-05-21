'use strict'
const {app, Menu, Tray, BrowserWindow, globalShortcut} = require('electron')

let win
let tray = null
let _menu = null
let close = false
let hideMode = true

const iconPath = __dirname + '/ico/trello.png'
const lock = app.requestSingleInstanceLock()

app.on('ready',()=>{
    // 싱글 인스턴스
    if (!lock)
        app.quit()

    // 윈도우 만들기
    win = new BrowserWindow({width : 850, height : 525 , show : false, icon : iconPath })
    win.loadURL("https://trello.com")
    win.setMenuBarVisibility(false)
    win.setMinimumSize(635,230)
    win.once('ready-to-show',()=>win.show())
    win.on('close',e=>{
        if (hideMode && !close){
            e.preventDefault()
            win.hide()
        }
    })

    //트레이 아이콘 만들기
    tray = new Tray(iconPath)
    _menu = Menu.buildFromTemplate([
        {
            label : 'Exit App\tCtrl+Q', 
            click(){
                close = true
                app.quit()
            }
        },
        {
            label : 'Hide on Closed',
            type : 'checkbox',
            checked : true,
            click(){
                hideMode = _menu.items[1].checked
                tray.setContextMenu(_menu)
            }
        }
    ])
    tray.setContextMenu(_menu)
    tray.on('click',e=>{
        win.show()
    })

    //핫키 설정
    globalShortcut.register('CommandOrControl+Q',()=>{
        if (win.isFocused() && win.isVisible()){
            close = true
            app.quit()
        }
    })
})

app.on('second-instance',()=>{
    if (win.isMinimized())
        win.restore()
    if (!win.isVisible())
        win.show()
    win.focus()
})

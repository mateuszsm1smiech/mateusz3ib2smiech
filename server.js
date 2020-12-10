var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;

var array = []

var login = false

var id = 0

var r = 2

app.use(express.static('static'))

var path = require("path")

var bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    if (login == false) {
        res.sendFile(path.join(__dirname + "/static/main.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/mainlogin.html"))
    }
})

app.get("/login", function (req, res) {
    if (login == false) {
        res.sendFile(path.join(__dirname + "/static/login.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/loginlogin.html"))
    }
})

app.post("/login", function (req, res) {
    var q = 0
    for (let w = 0; w < array.length; w++) {
        if (array[w].log == req.body.login && array[w].pass == req.body.password) {
            q = 1
        }
    }
    if (q == 1) {
        login = true
        res.redirect("/admin")
    } else {
        var send = "<p>błędne dane logowania</p>"
        res.send(send)
    }
})

app.get("/register", function (req, res) {
    if (login == false) {
        res.sendFile(path.join(__dirname + "/static/register.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/registerlogin.html"))
    }
})

app.post("/register", function (req, res) {
    var e = 1
    for (let w = 0; w < array.length; w++) {
        if (array[w].log == req.body.login) {
            e = 0
        }
    }
    if (e == 1) {
        id += 1
        var data = {
            id: id,
            log: req.body.login,
            pass: req.body.password,
            wiek: parseInt(req.body.wiek),
            uczen: req.body.uczen,
            plec: req.body.plec
        }
        array.push(data)
        var send = "<p>rejestracja przebiegła pomyślnie</p>"
    } else {
        var send = "<p>login już w użytku</p>"
    }
    res.send(send)
})

app.get("/logout", function (req, res) {
    login = false
    res.redirect("/")
})

app.get("/admin", function (req, res) {
    if (login == false) {
        res.sendFile(path.join(__dirname + "/static/admin.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/adminlogin.html"))
    }
})

app.get("/sort", function (req, res) {
    if (login == false) {
        res.redirect("/admin")
    } else {
        var send = '<header id="header" style="background: rgb(0, 139, 86);"> <a href="/sort" style="text-decoration: none; font-size: 30px; margin-left: 15px;">sort</a> <a href="/gender" style="text-decoration: none; font-size: 30px; margin-left: 15px;">gender</a> <a href="/show" style="text-decoration: none; font-size: 30px; margin-left: 15px;">show</a> </header>'
        if (r == 2) {
            array.sort(function (e, q) {
                return parseFloat(e.id) - parseFloat(q.id);
            });
            send += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='up'><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='down'><form>"
        } else if (r == 1) {
            send += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' checked id='rosnaco' name='sort' value='up'><label>malejaco</label><input type='radio' id='malejaco' name='sort' value='down'><form>"
        } else {
            send += "<form action='/sort' method ='POST' onchange='this.submit()'><label>rosnąco</label><input type='radio' id='rosnaco' name='sort' value='up'><label>malejaco</label><input type='radio' checked id='malejaco' name='sort' value='down'><form>"
        }
        app.post("/sort", function (req, res) {
            if (req.body.sort == "up") {
                array.sort(function (e, q) {
                    return parseFloat(e.wiek) - parseFloat(q.wiek);
                });
                r = 1
                res.redirect("/sort")
            } else {
                array.sort(function (e, q) {
                    return parseFloat(q.wiek) - parseFloat(e.wiek);
                });
                r = 0
                res.redirect("/sort")
            }
        })
        send += '<table>'
        for (let w = 0; w < array.length; w++) {
            let tab = Object.entries(array[w])
            send += '<tr>'
            send += '<td style="border: 2px solid black;">' + tab[0][0] + ': ' + tab[0][1] + '</td>'
            send += '<td style="border: 2px solid black;">user: ' + tab[1][1] + ' - ' + tab[2][1] + '</td>'
            send += '<td style="border: 2px solid black;">' + tab[3][0] + ': ' + tab[3][1] + '</td>'
            send += '</tr>'
        }
        send += '</table>'
        res.send(send)
        r = 2
    }
})

app.get("/gender", function (req, res) {
    if (login == false) {
        res.redirect("/admin")
    } else {
        var send = '<header id="header" style="background: rgb(0, 139, 86);"> <a href="/sort" style="text-decoration: none; font-size: 30px; margin-left: 15px;">sort</a> <a href="/gender" style="text-decoration: none; font-size: 30px; margin-left: 15px;">gender</a> <a href="/show" style="text-decoration: none; font-size: 30px; margin-left: 15px;">show</a> </header>'
        send += '<table>'
        for (let w = 0; w < array.length; w++) {
            let tab = Object.entries(array[w])
            if (tab[5][1] == "K") {
                send += '</tr>'
                send += '<td style="border: 2px solid black;">' + tab[0][0] + ': ' + tab[0][1] + '<td>'
                send += '<td style="border: 2px solid black;">' + tab[5][0] + ': ' + tab[5][1] + '<td>'
                send += '</tr>'
            }
        }
        send += '</table>'
        send += '<br>'
        send += '<table>'
        for (let w = 0; w < array.length; w++) {
            let tab = Object.entries(array[w])
            if (tab[5][1] == "M") {
                send += '<tr>'
                send += '<td style="border: 2px solid black;">' + tab[0][0] + ': ' + tab[0][1] + '</td>'
                send += '<td style="border: 2px solid black;">' + tab[5][0] + ': ' + tab[5][1] + '</td>'
                send += '</tr>'
            }
        }
        send += '</table>'
        res.send(send)
    }
})

app.get("/show", function (req, res) {

    if (login == false) {
        res.redirect("/admin")
    } else {
        array.sort(function (e, q) {
            return parseFloat(e.id) - parseFloat(q.id);
        });
        var send = '<header id="header" style="background: rgb(0, 139, 86);"> <a href="/sort" style="text-decoration: none; font-size: 30px; margin-left: 15px;">sort</a> <a href="/gender" style="text-decoration: none; font-size: 30px; margin-left: 15px;">gender</a> <a href="/show" style="text-decoration: none; font-size: 30px; margin-left: 15px;">show</a> </header>'
        send += '<table>'
        for (let w = 0; w < array.length; w++) {
            let tab = Object.entries(array[w])
            send += '<tr>'
            send += '<td style="border: 2px solid black;">' + tab[0][0] + ': ' + tab[0][1] + '</td>'
            send += '<td style="border: 2px solid black;">user: ' + tab[1][1] + ' - ' + tab[2][1] + '</td>'
            if (tab[4][1] == "check") {
                send += '<td style="border: 2px solid black;">' + tab[4][0] + ': ' + '<label><input type="checkbox" checked disabled></label>' + '</td>'
            } else {
                send += '<td style="border: 2px solid black;">' + tab[4][0] + ': ' + '<label><input type="checkbox" disabled></label>' + '</td>'
            }
            send += '<td style="border: 2px solid black;">' + tab[3][0] + ': ' + tab[3][1] + '</td>'
            send += '<td style="border: 2px solid black;">' + tab[5][0] + ': ' + tab[5][1] + '</td>'
            send += '</tr>'
        }
        send += '</table>'
        res.send(send)
    }
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
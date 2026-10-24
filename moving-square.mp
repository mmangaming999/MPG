add "MPG"
win("MPG Moving Square", 640, 480)
background("black")
fps(60)
goto(150, 150)
set player to stamp("square", 40, "green")
Long(isopen()) do {
    if (key("right")) do {
        move(player, 4, 0)
    }
    if (key("left")) do {
        move(player, -4, 0)
    }
    if (key("up")) do {
        move(player, 0, -4)
    }
    if (key("down")) do {
        move(player, 0, 4)
    }
    if (key("escape")) do {
        quit()
    }
    clear()
    update()
}

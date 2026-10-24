add "MPG"
win("Clone Test", 500, 350)
fps(60)
goto(160, 150)
set a to stamp("square", 45, "blue")
set b to clone(a)
goto(b, 270, 150)
Long(isopen()) do {
    if (key("escape")) do {
        quit()
    }
    clear("black")
    update()
}

class Timer {
    constructor() {
        this.interval;
        this.time = 120;
        this.timer = document.getElementById("timer");
    }

    start() {
        this.timer.innerHTML = '02:00'; 
        this.time = 120;
        this.interval = setInterval(() => {
            this.time -= 1;
            var minutes = parseInt(this.time / 60);
            var seconds = this.time % 60;


            if(seconds < 10)
                seconds = '0' + seconds;
            
            this.timer.innerHTML = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
            
            if(minutes == 0 && seconds == 0) {
                if (game.gameState.turn == 'j1')
                    game.game_finished(1, 0);
                else
                    game.game_finished(2, 0);
                clearInterval(this.interval);
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.interval)
    }
}
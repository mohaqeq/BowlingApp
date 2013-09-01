var scoreboardViewModel = function () {
    var self = this;

    this.score = ko.observable(0);

    this.frames = ko.observableArray([]);

    this.completed = ko.computed(function () {
        return self.frames().length >= 10 && self.frames()[9].state() == 4;
    });

    this.totalscore = ko.computed(function () {
        var s = 0;
        ko.utils.arrayForEach(self.frames(), function (frame) {
            if (frame.realframe() && frame.state() == 4)
                s += Number(frame.framescore());
        });
        return s;
    });

    this.add = function () {
        if (self.completed())
            return;
        self.addscore(self.score);
        $("html, body").animate({ scrollTop: $(document).height()}, "slow");
    }

    this.clear = function () {
        self.frames([])
    }

    this.addscore = function (score) {
        if (self.completed()) {
            alert("Scoreboard completed!");
            return;
        }
        self.addtoframe(score);
    }

    this.addtoframe = function (score) {
        if (self.frames().length == 0 || self.frames()[self.frames().length - 1].state() > 1)
            self.frames.push(new frame(self.frames().length >= 10));

        ko.utils.arrayForEach(self.frames(), function (frame) {
            if (frame.state() < 4)
                frame.addscore(score());
        });
    }
}

var frame = function (extension) {
    var self = this;

    this.firstball = ko.observable(0);
    this.secondball = ko.observable(0);
    this.strikball = ko.observable(0);
    this.spareball = ko.observable(0);
    this.state = ko.observable(0);
    this.strike = ko.observable(false);
    this.spare = ko.observable(false);
    this.realframe = ko.observable(!extension);

    this.framescore = ko.computed(function () {
        return Number(self.firstball()) + Number(self.secondball()) + Number(self.spareball()) + Number(self.strikball());
    });

    this.label = ko.computed(function () {
        return self.firstball() + " " + self.secondball() + " - " + self.framescore();
    });

    this.addscore = function (score) {
        if (self.state() < 2 && Number(self.firstball()) + Number(score) > 10) {
            alert("Score must be less than or equal " + (10 - self.firstball()));
            return;
        }
        self.check(score);
    }

    this.check = function (score) {
        switch (self.state()) {
            case 0:
                self.firstball(score);
                if (score < 10)
                    self.state(1);
                else {
                    self.state(2);
                    self.strike(self.realframe());
                }
                break;
            case 1:
                self.secondball(score);
                if (self.framescore() < 10)
                    self.state(4);
                else {
                    self.state(3);
                    self.spare(self.realframe());
                }
                break;
            case 2:
                self.strikball(score);
                self.state(3);
                break;
            case 3:
                self.spareball(score);
                self.state(4);
                break;
            case 4:
                alert("Frame completed!");
        }

    }
}


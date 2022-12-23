let app = function () {

    let $question = document.getElementById("question");
    let $answer = document.getElementById("answer");
    let $enter = document.getElementById("enter");
    let $stats = document.getElementById("stats");

    let a = 0;
    let b = 0;

    let next = [];

    $answer.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            $enter.click();
        }
    });

    getCheckBoxes().forEach((e) => e.addEventListener('change', function () {
        next = [];
        newQuestion();
    }))

    newQuestion();
    render();

    function getCheckBoxes() {
        let boxes = document.querySelectorAll('input[type=checkbox]:checked');
        return Array.from(boxes);
    }

    function getChecked() {
        return getCheckBoxes().map((b) => parseInt(b.name));
    }

    function generateNext() {
        let values = getChecked();

        let n = [];
        let m = Number.MAX_SAFE_INTEGER;

        for (let i = 0; i < 11; i++) {
            for (const v of values) {
                let score = getStats(i + "x" + v);
                if (score < m) {
                    m = score;
                }
                n.push({a: i, b: v, score: score});
            }
        }

        next = n.filter(i => i.score === m);
        shuffle(next);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function newQuestion() {
        if (next.length === 0) {
            generateNext();
        }

        let o = next.shift();

        a = o.a;
        b = o.b;

        $question.textContent = a + " x " + b + " = ";
    }

    function resetAnswer() {
        $answer.value = "";
    }

    function render() {
        for (let i = 0; i <= 10; i++) {
            for (let j = 0; j <= 10; j++) {
                let s = getStats(i + "x" + j);
                let cell = $stats.rows[i + 1].cells[j + 1];

                if (s === 0) {
                    cell.bgColor = "white";
                } else if (s > 0) {
                    cell.bgColor = "green";
                } else {
                    cell.bgColor = "red";
                }

                cell.innerText = s;
            }
        }
    }

    function check() {
        let actual = parseInt($answer.value);
        let expected = a * b;

        updateStats(actual === expected);
        render();
        resetAnswer();

        if (actual === expected) {
            newQuestion();
        } else {
            // show error
        }
    }

    function updateStats(ok) {
        let key = a + "x" + b;
        let x = getStats(key);

        if (ok) {
            localStorage.setItem(key, "" + x >= 0 ? x + 1 : 0);
        } else {
            localStorage.setItem(key, "" + (x - 1));
        }
    }

    function getStats(key) {
        let v = localStorage.getItem(key);
        if (v === null) {
            return 0;
        } else {
            return parseInt(v);
        }
    }

    function resetStats() {
        localStorage.clear();
        render();
    }

    return {
        check: check,
        reset: resetStats,
    };

}();
javascript:(async function(){
    const sleep = (ms) => new Promise(res => setTimeout(res, ms));
    const findBtn = (txt) => Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes(txt));

    console.log("🚀 Starting 2026 Bracket Automator...");

    // 1. PHASE ONE: FILLING
    async function fillRound() {
        let pickedAny = false;
        const unpicked = Array.from(document.querySelectorAll('input.BracketOutcome-radio'))
            .filter(i => !i.checked && !i.disabled);
        
        const groups = {};
        unpicked.forEach(r => { if(!groups[r.name]) groups[r.name] = []; groups[r.name].push(r); });

        for (let name in groups) {
            const pair = groups[name];
            if (pair.length === 2) {
                const getSeed = (r) => parseInt((r.closest('.BracketOutcome-pointer') || r.closest('label')).querySelector('.BracketOutcome-metadata').innerText);
                const s0 = getSeed(pair[0]), s1 = getSeed(pair[1]);
                const fav = s0 < s1 ? pair[0] : pair[1];
                const dog = s0 < s1 ? pair[1] : pair[0];
                (Math.random() > 0.9 ? dog : fav).click();
                pickedAny = true;
            }
        }
        return pickedAny;
    }

    // Keep filling until no more unpicked matchups exist
    while (await fillRound()) { await sleep(200); }

    // 2. PHASE TWO: TIEBREAKER
    const tbInput = document.querySelector('input[placeholder="###"]') || document.querySelector('input[inputmode="numeric"]');
    if (tbInput) {
        const score = Math.floor(Math.random() * 21) + 130;
        tbInput.focus();
        tbInput.value = score;
        tbInput.dispatchEvent(new Event('input', { bubbles: true }));
        tbInput.dispatchEvent(new Event('change', { bubbles: true }));
        tbInput.blur();
        console.log(`✅ Tiebreaker set to ${score}`);
    }

    // 3. PHASE THREE: SUBMIT & RESTART
    window.scrollTo(0, document.body.scrollHeight);
    const submitBtn = findBtn('Submit Bracket');
    
    if (submitBtn) {
        submitBtn.click();
        console.log("🔥 Submitted! Waiting for 'Create Another' button...");

        // Polling loop to find the "Create Another" button (checks every 500ms)
        const poll = setInterval(() => {
            const createBtn = findBtn('Create Another Bracket');
            if (createBtn) {
                clearInterval(poll);
                createBtn.click();
                console.log("🔄 Starting fresh bracket!");
            }
        }, 500);
    } else {
        alert("⚠️ Please log in to ESPN or check if the bracket is already full!");
    }
})();

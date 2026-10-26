(function () {
      "use strict";

      var STOPWORDS = {};
      ("a an the and or of to in for on with at by from as is are was were be been being will would can could should may might must shall do does did have has had having i you he she it we they them his her its our their this that these those am not no yes if but so than then when where which who whom what how all any both each few more most other some such only own same too very just also into over under between about after before during while per via etc including include includes required requirements preferred plus work working team teams ability abilities experience years year strong excellent good great new help support using use used day daily help us our company business job role position candidate ideal looking join opportunity opportunities environment fast paced related field knowledge skills skill ability responsibilities qualifications minimum basic plus bonus point points ensure ensuring provide providing assist assisting handle handling perform performing maintain maintaining across within across various other others etc.").split(" ").forEach(function (w) { STOPWORDS[w] = true; });

      var ROLE_KEYWORDS = {
        "customer-support": { label: "Customer Support", keywords: ["customer service","communication","problem solving","crm","zendesk","troubleshooting","empathy","conflict resolution","support tickets","live chat","phone support","multitasking","patience","data entry","microsoft office","customer satisfaction","email support","intercom","salesforce"] },
        "data-entry": { label: "Data Entry", keywords: ["data entry","typing","accuracy","attention to detail","microsoft excel","google sheets","data validation","spreadsheets","10-key","clerical","filing","database","data processing","copy typing","proofreading","microsoft word"] },
        "virtual-assistant": { label: "Virtual Assistant", keywords: ["calendar management","email management","scheduling","google workspace","microsoft office","data entry","internet research","travel arrangements","invoicing","social media","communication","slack","zoom","canva","bookkeeping","file management"] },
        "sales": { label: "Sales Representative", keywords: ["sales","lead generation","cold calling","crm","negotiation","closing","sales quota","customer relationships","product knowledge","communication","follow-up","upselling","pipeline","salesforce","objection handling"] },
        "chat-support": { label: "Chat Support", keywords: ["live chat","typing speed","customer service","written communication","multitasking","crm","troubleshooting","empathy","grammar","zendesk","intercom","chat support","simultaneous chats","problem solving"] }
      };

      var ACTION_VERBS = ["achieved","improved","increased","reduced","managed","led","created","developed","resolved","handled","processed","trained","delivered","supported","organized","built","designed","launched","automated","saved","grew","coordinated","assisted","maintained","prepared","answered","completed","earned","won","promoted","streamlined","generated","converted","negotiated","scheduled","researched","wrote","edited","tested","fixed","shipped","onboarded","mentored","presented","sold","cleaned","entered","verified","updated","tracked","monitored"];

      var SAMPLE_RESUME = [
        "JORDAN ELLIS",
        "jordan.ellis@email.com | (555) 014-2280 | Austin, TX",
        "",
        "Objective: Hardworking and friendly person looking for a remote job. I am a fast learner and good with computers.",
        "",
        "Experience",
        "Retail Sales Associate — City Mart, Austin, TX (2022 – Present)",
        "- Helped customers find products and answered questions at the register",
        "- Responsible for stocking shelves and keeping the store tidy",
        "- Handled cash and card payments",
        "- Worked with a team of 5 people",
        "",
        "Volunteer — Community Food Bank (2021 – 2022)",
        "- Packed food boxes for families",
        "- Entered donor information into a spreadsheet",
        "",
        "Education",
        "High School Diploma — Westfield High School, 2021",
        "",
        "Skills",
        "Microsoft Word, cash register, friendly, hardworking, fast learner"
      ].join("\n");

      var SAMPLE_JD = [
        "Remote Customer Support Representative",
        "",
        "We are looking for a friendly Customer Support Representative to help our customers by email and live chat.",
        "",
        "Responsibilities:",
        "- Answer customer questions by email support and live chat using Zendesk",
        "- Troubleshoot basic account and order problems (problem solving)",
        "- Create and update support tickets in our CRM",
        "- Escalate difficult cases and use conflict resolution to keep customers calm",
        "",
        "Requirements:",
        "- Customer service experience, retail experience counts",
        "- Strong written communication and empathy",
        "- Multitasking: handle 3 live chats at once",
        "- Microsoft Office and data entry skills",
        "- Customer satisfaction mindset; Intercom or Salesforce experience is a plus"
      ].join("\n");

      var $ = function (id) { return document.getElementById(id); };
      var resumeInput = $("resumeInput"), jdInput = $("jdInput");
      var selectedRole = null;
      var lastReport = "";

      function wordCount(text) {
        var m = text.trim().match(/\S+/g);
        return m ? m.length : 0;
      }
      function updateCounts() {
        $("resumeCount").textContent = wordCount(resumeInput.value) + " words";
        $("jdCount").textContent = wordCount(jdInput.value) + " words";
      }
      resumeInput.addEventListener("input", updateCounts);
      jdInput.addEventListener("input", updateCounts);

      // Role buttons
      var roleBtns = document.querySelectorAll(".role-btn");
      roleBtns.forEach(function (btn) {
        btn.addEventListener("click", function () {
          var role = btn.getAttribute("data-role");
          if (selectedRole === role) {
            selectedRole = null;
            btn.setAttribute("aria-pressed", "false");
          } else {
            selectedRole = role;
            roleBtns.forEach(function (b) { b.setAttribute("aria-pressed", b === btn ? "true" : "false"); });
          }
        });
      });

      // File upload (.txt)
      function wireFile(btnId, inputId, target) {
        $(btnId).addEventListener("click", function () { $(inputId).click(); });
        $(inputId).addEventListener("change", function (e) {
          var file = e.target.files && e.target.files[0];
          if (!file) return;
          var reader = new FileReader();
          reader.onload = function () { target.value = String(reader.result || ""); updateCounts(); };
          reader.readAsText(file);
          e.target.value = "";
        });
      }
      wireFile("resumeFileBtn", "resumeFile", resumeInput);
      wireFile("jdFileBtn", "jdFile", jdInput);

      $("sampleBtn").addEventListener("click", function () {
        resumeInput.value = SAMPLE_RESUME;
        jdInput.value = SAMPLE_JD;
        selectedRole = "customer-support";
        roleBtns.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-role") === "customer-support" ? "true" : "false"); });
        updateCounts();
        runCheck();
      });

      $("checkBtn").addEventListener("click", runCheck);

      var SKILL_LEXICON = ["customer service","customer support","customer satisfaction","problem solving","conflict resolution","written communication","verbal communication","communication skills","live chat","chat support","email support","phone support","support tickets","troubleshooting","data entry","data processing","microsoft office","microsoft excel","microsoft word","google sheets","google workspace","google docs","zendesk","intercom","salesforce","freshdesk","hubspot","crm","multitasking","time management","attention to detail","calendar management","email management","scheduling","virtual assistant","lead generation","cold calling","negotiation","social media","bookkeeping","invoicing","typing","proofreading","active listening","empathy","teamwork","training","quality assurance","order processing","inventory","cash handling","point of sale","slack","zoom","canva","quickbooks","shopify","wordpress","html","css","javascript","sql"];

      var KEYWORD_ALIASES = {
        "customer service": ["customer support", "client service", "client support"],
        "customer support": ["customer service", "client service", "client support"],
        "client service": ["customer service", "customer support", "client support"],
        "client support": ["customer service", "customer support", "client service"],
        "live chat": ["chat support"],
        "chat support": ["live chat"],
        "phone support": ["telephone support"],
        "telephone support": ["phone support"],
        "microsoft excel": ["excel"],
        "microsoft word": ["word"],
        "google sheets": ["spreadsheets"],
        "spreadsheets": ["google sheets"]
      };

      function normalize(text) { return " " + text.toLowerCase().replace(/[^a-z0-9+#./ ]+/g, " ").replace(/\s+/g, " ") + " "; }
      function containsPhrase(normText, phrase) {
        var p = normalize(phrase);
        if (normText.indexOf(p) !== -1) return true;
        // Plural tolerance: "customers" in the resume should match keyword "customer", and vice versa
        var words = p.trim().split(" ");
        var last = words[words.length - 1];
        var variants = [];
        if (last.length > 3 && last.charAt(last.length - 1) === "s") { var v1 = words.slice(); v1[v1.length - 1] = last.slice(0, -1); variants.push(" " + v1.join(" ") + " "); }
        if (last.length > 2 && last.charAt(last.length - 1) !== "s") { var v2 = words.slice(); v2[v2.length - 1] = last + "s"; variants.push(" " + v2.join(" ") + " "); }
        return variants.some(function (v) { return normText.indexOf(v) !== -1; });
      }

      function matchedKeyword(normText, keyword) {
        var candidates = [keyword].concat(KEYWORD_ALIASES[keyword] || []);
        for (var i = 0; i < candidates.length; i++) {
          if (containsPhrase(normText, candidates[i])) return candidates[i];
        }
        return null;
      }

      function keywordsEquivalent(first, second) {
        return first === second ||
          (KEYWORD_ALIASES[first] || []).indexOf(second) !== -1 ||
          (KEYWORD_ALIASES[second] || []).indexOf(first) !== -1;
      }

      function extractKeywords(jdText) {
        var normJd = normalize(jdText);
        var picked = [];
        function alreadyCovered(k) {
          return picked.some(function (p) {
            return keywordsEquivalent(p, k) || p.indexOf(k) !== -1 || k.indexOf(p) !== -1;
          });
        }
        // 1) Known skill phrases and tools mentioned in the job post — these anchor the list
        SKILL_LEXICON.forEach(function (term) {
          if (containsPhrase(normJd, term) && !alreadyCovered(term)) picked.push(term);
        });
        // 2) Repeated phrases from the post itself, extracted within sentence/line segments only
        var segments = jdText.toLowerCase().split(/[\n\r.!?;:•·()\[\]{}"“”]+/);
        var freq = {};
        segments.forEach(function (seg) {
          var words = seg.replace(/[^a-z0-9+# ]+/g, " ").split(/\s+/).filter(Boolean);
          for (var i = 0; i < words.length; i++) {
            var w = words[i];
            if (w.length < 3 || STOPWORDS[w]) continue;
            freq[w] = (freq[w] || 0) + 1;
            if (i + 1 < words.length && !STOPWORDS[words[i + 1]] && words[i + 1].length >= 3) {
              var bg = w + " " + words[i + 1];
              freq[bg] = (freq[bg] || 0) + 1;
            }
          }
        });
        var rest = Object.keys(freq).filter(function (k) {
          return k.indexOf(" ") !== -1 ? freq[k] >= 2 : freq[k] >= 3;
        }).map(function (k) { return { k: k, f: freq[k] }; });
        rest.sort(function (a, b) { return b.f - a.f; });
        for (var j = 0; j < rest.length && picked.length < 20; j++) {
          var rk = rest[j].k;
          // A very frequent single word (e.g. "customer") earns its own slot even
          // when a longer picked phrase contains it — otherwise a resume that
          // clearly works with customers can score a misleading 0.
          if (rk.indexOf(" ") === -1 && rest[j].f >= 4) {
            if (picked.indexOf(rk) === -1) picked.push(rk);
          } else if (!alreadyCovered(rk)) {
            picked.push(rk);
          }
        }
        return picked.slice(0, 20);
      }

      function badgeSVG(type) {
        if (type === "pass") return '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M2.5 8.5 6 12 13.5 4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        if (type === "warn") return '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M8 3v6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><circle cx="8" cy="12.4" r="1.4" fill="currentColor"/></svg>';
        return '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
      }
      function checkItem(type, title, fix) {
        return '<li><span class="badge ' + type + '">' + badgeSVG(type) + '</span><span>' + title + (fix ? '<span class="fix">' + fix + '</span>' : "") + "</span></li>";
      }

      function runCheck() {
        var resume = resumeInput.value;
        var jd = jdInput.value.trim();
        var err = $("formError");
        if (wordCount(resume) < 30) {
          err.textContent = "Please paste your full resume first — it looks too short to check (under 30 words).";
          err.classList.add("show");
          resumeInput.focus();
          return;
        }
        if (!jd && !selectedRole) {
          err.textContent = "One more thing: paste a job description, or pick your target role at the top — the keyword match needs one of them.";
          err.classList.add("show");
          return;
        }
        err.classList.remove("show");

        var norm = normalize(resume);
        var lower = resume.toLowerCase();
        var words = wordCount(resume);

        // ---- Contact ----
        var hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resume);
        var hasPhone = /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/.test(resume);

        // ---- Sections ----
        var hasExperience = /(experience|employment history|work history)/.test(lower);
        var hasEducation = /(education|high school|bachelor|associate|diploma|degree|university|college)/.test(lower);
        var hasSkills = /(skills|technical skills|core competencies)/.test(lower);
        var hasSummary = /(summary|objective|profile|about me)/.test(lower);

        // ---- Keywords ----
        var keywords, basisLabel;
        if (jd) {
          keywords = extractKeywords(jd);
          basisLabel = "the job description you pasted";
        } else {
          keywords = ROLE_KEYWORDS[selectedRole].keywords.slice();
          basisLabel = "typical " + ROLE_KEYWORDS[selectedRole].label + " job posts";
        }
        var hits = [], misses = [], matchedTerms = {};
        keywords.forEach(function (k) {
          var matchedTerm = matchedKeyword(norm, k);
          if (matchedTerm) {
            hits.push(k);
            matchedTerms[k] = matchedTerm;
          } else {
            misses.push(k);
          }
        });
        var kwRatio = keywords.length ? hits.length / keywords.length : 0;

        // ---- Verbs & numbers ----
        var verbFound = {};
        ACTION_VERBS.forEach(function (v) { if (containsPhrase(norm, v)) verbFound[v] = true; });
        var verbCount = Object.keys(verbFound).length;
        var numMatches = resume.match(/\$\s?\d[\d,]*|\d[\d,]*\s*(%|percent|customers?|clients?|tickets?|calls?|emails?|orders?|users?|people|hours?|days?|sales|leads|students?|projects?|team of \d+)/gi);
        var numCount = numMatches ? numMatches.length : 0;
        var hasFancySymbols = /[★☆●◆■▲►♥♦]/.test(resume);

        // ---- Score (rubric) ----
        var sContact = (hasEmail ? 6 : 0) + (hasPhone ? 4 : 0);
        var sSections = (hasSkills ? 8 : 0) + (hasExperience ? 8 : 0) + (hasEducation ? 4 : 0);
        var sKeywords = Math.round(kwRatio * 40);
        var sLength = (words >= 300 && words <= 800) ? 10 : (words >= 200 && words <= 1000) ? 6 : 3;
        var sVerbs = Math.min(10, Math.round(verbCount / 6 * 10));
        var sNumbers = Math.min(10, Math.round(numCount / 3 * 10));
        var score = sContact + sSections + sKeywords + sLength + sVerbs + sNumbers;
        $("scoreKeywords").textContent = sKeywords + "/40";
        $("scoreSections").textContent = sSections + "/20";
        $("scoreContact").textContent = sContact + "/10";
        $("scoreLength").textContent = sLength + "/10";
        $("scoreVerbs").textContent = sVerbs + "/10";
        $("scoreNumbers").textContent = sNumbers + "/10";

        // ---- Render: score ----
        var results = $("results");
        results.classList.add("show");
        $("scoreNum").textContent = score;
        var C = 502.65;
        var bar = $("gaugeBar");
        bar.style.strokeDashoffset = C;
        requestAnimationFrame(function () { requestAnimationFrame(function () { bar.style.strokeDashoffset = (C * (1 - score / 100)).toFixed(1); }); });
        bar.style.stroke = score >= 75 ? "var(--good)" : score >= 55 ? "var(--warn)" : "var(--bad)";

        var verdicts = [
          { min: 85, t: "Strong checklist match", p: "Your resume matches many of the text and structure checks in this estimate. Review the suggestions, verify every claim, and tailor your application to the role." },
          { min: 75, t: "Good checklist match", p: "Your resume meets many of these checks. Review the category breakdown and add only missing keywords that accurately describe your experience." },
          { min: 55, t: "Some useful improvements to consider", p: "The checklist found a few areas you could review. Use the breakdown and suggestions below as guidance, not as a prediction of how an employer will rank you." },
          { min: 0, t: "Review the checklist suggestions", p: "This estimate found several areas you may want to review. A lower score is not a prediction of rejection; focus on accurate, relevant improvements." }
        ];
        var v = verdicts.filter(function (x) { return score >= x.min; })[0];
        $("verdictTitle").textContent = v.t;
        $("verdictText").textContent = v.p;
        $("scoreBasis").textContent = "Checklist estimate matched against " + basisLabel + ". It is not an ATS ranking.";

        // ---- Render: checks ----
        var checks = "";
        checks += hasEmail ? checkItem("pass", "Email address found") : checkItem("fail", "No email address found", "Add your email at the very top of the resume — recruiters can't contact you without it.");
        checks += hasPhone ? checkItem("pass", "Phone number found") : checkItem("warn", "No phone number found", "Add a phone number near your name unless the job post says otherwise.");
        checks += hasExperience ? checkItem("pass", "Experience section found") : checkItem("fail", "No Experience section heading", "Add an \"Experience\" heading. No paid job yet? Use projects, volunteering, freelance or family-business work under it.");
        checks += hasSkills ? checkItem("pass", "Skills section found") : checkItem("fail", "No Skills section", "Add a Skills section listing your tools and abilities in a simple list — this is where ATS keyword matching works hardest.");
        checks += hasEducation ? checkItem("pass", "Education found") : checkItem("warn", "No education mentioned", "Add an Education section, even if it's a high school diploma or a course you're taking now.");
        checks += hasSummary ? checkItem("pass", "Summary / objective included") : checkItem("warn", "No summary or objective line", "Add 2–3 lines at the top naming the role you want and your strongest matching skills, using words from the job post.");
        if (words >= 300 && words <= 800) checks += checkItem("pass", "Length is in the ideal range (" + words + " words)", "");
        else if (words < 300) checks += checkItem("fail", "Resume is short (" + words + " words)", "Aim for 300–700 words. Add bullet points under each role describing what you actually did — that's also where keywords live.");
        else checks += checkItem("warn", "Resume is long (" + words + " words)", "Over ~800 words usually means padding. Cut the oldest and least relevant details first; one focused page wins for beginner roles.");
        if (hasFancySymbols) checks += checkItem("warn", "Decorative symbols detected (★ ● ◆ …)", "Some ATS software reads these as garbage characters. Use plain hyphens or simple bullets instead.");
        $("checkList").innerHTML = checks;

        // ---- Render: strength ----
        $("statWords").textContent = words;
        $("statVerbs").textContent = verbCount;
        $("statNumbers").textContent = numCount;
        var strength = "";
        strength += verbCount >= 6 ? checkItem("pass", "Strong action verbs: " + Object.keys(verbFound).slice(0, 6).join(", ") + "…") :
          checkItem("warn", "Only " + verbCount + " strong action verb" + (verbCount === 1 ? "" : "s") + " found", "Start bullets with verbs like resolved, handled, processed, trained, improved, increased. Swap \"responsible for\" for the verb that says what you did.");
        strength += numCount >= 3 ? checkItem("pass", "Bullets include real numbers — recruiters love this") :
          checkItem("warn", "Only " + numCount + " result" + (numCount === 1 ? "" : "s") + " with numbers", "Add honest numbers: \"answered 40+ emails a day\", \"team of 5\", \"98% on-time\". Numbers prove scale and smuggle in keywords.");
        var respFor = (lower.match(/responsible for/g) || []).length;
        if (respFor > 0) strength += checkItem("warn", "\"Responsible for\" appears " + respFor + " time" + (respFor === 1 ? "" : "s"), "It's the weakest phrase on a resume. Replace each one with an action verb + what you actually did.");
        $("strengthList").innerHTML = strength;

        // ---- Render: keywords ----
        $("kwSub").textContent = "Matched " + hits.length + " of " + keywords.length + " keywords from " + basisLabel + " (" + Math.round(kwRatio * 100) + "%).";
        function renderKeywordPills(container, terms, className) {
          container.replaceChildren();
          terms.forEach(function (term) {
            var pill = document.createElement("span");
            pill.className = "pill " + className;
            pill.textContent = term;
            if (matchedTerms[term] && matchedTerms[term] !== term) {
              pill.title = "Matched via: " + matchedTerms[term];
              pill.setAttribute("aria-label", term + " (matched via " + matchedTerms[term] + ")");
            }
            container.appendChild(pill);
          });
        }
        renderKeywordPills($("hitPills"), hits, "hit");
        renderKeywordPills($("missPills"), misses, "miss");
        $("hitTitle").style.display = hits.length ? "" : "none";
        $("hitPills").style.display = hits.length ? "" : "none";
        $("missTitle").style.display = misses.length ? "" : "none";
        $("missPills").style.display = misses.length ? "" : "none";
        var kwEmpty = $("kwEmpty");
        if (!keywords.length) { kwEmpty.style.display = "block"; kwEmpty.textContent = "No keywords could be extracted — try pasting the full job description."; }
        else if (!misses.length) { kwEmpty.style.display = "block"; kwEmpty.textContent = "Every keyword matched. Excellent — make sure each one is backed by a real bullet, not just listed."; }
        else kwEmpty.style.display = "none";

        // ---- Report (copy / download) ----
        var lines = [];
        lines.push("ATS RESUME CHECK — YOUR FIX LIST");
        lines.push("Checklist estimate: " + score + "/100 (" + v.t + ")");
        lines.push("Breakdown: keywords " + sKeywords + "/40; sections " + sSections + "/20; contact " + sContact + "/10; length " + sLength + "/10; action verbs " + sVerbs + "/10; numbers " + sNumbers + "/10.");
        lines.push("This is not an ATS ranking or an interview prediction.");
        lines.push("Keywords matched: " + hits.length + "/" + keywords.length + " against " + basisLabel + ".");
        lines.push("");
        if (misses.length) { lines.push("MISSING KEYWORDS TO ADD (only the ones you honestly have):"); misses.forEach(function (k) { lines.push("  - " + k); }); lines.push(""); }
        lines.push("FIXES:");
        if (!hasEmail) lines.push("  - Add your email address at the top of the resume.");
        if (!hasPhone) lines.push("  - Add a phone number near your name.");
        if (!hasExperience) lines.push("  - Add an Experience section (projects, volunteering and freelance count).");
        if (!hasSkills) lines.push("  - Add a Skills section with your tools and abilities.");
        if (!hasEducation) lines.push("  - Add an Education section.");
        if (!hasSummary) lines.push("  - Add a 2-3 line summary naming the role and your top skills.");
        if (words < 300) lines.push("  - Lengthen to 300-700 words with real bullet points.");
        if (words > 800) lines.push("  - Trim toward 300-700 words; cut the least relevant details.");
        if (verbCount < 6) lines.push("  - Start more bullets with action verbs (resolved, handled, processed, trained, improved).");
        if (numCount < 3) lines.push("  - Add honest numbers to bullets (amounts, counts, percentages).");
        if (respFor > 0) lines.push("  - Replace \"responsible for\" with action verbs.");
        if (hasFancySymbols) lines.push("  - Remove decorative symbols; use plain bullets.");
        if (lines[lines.length - 1] === "FIXES:") lines.push("  - No structural fixes needed. Tailor the top bullets to this job post and proofread.");
        lines.push("");
        lines.push("Checked free at the ATS Resume Checker. Score is an estimate, not a guarantee.");
        lastReport = lines.join("\n");

        results.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      $("copyBtn").addEventListener("click", function () {
        function done() { var ok = $("copyOk"); ok.classList.add("show"); setTimeout(function () { ok.classList.remove("show"); }, 3000); }
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lastReport).then(done, function () { fallbackCopy(); done(); });
        } else { fallbackCopy(); done(); }
        function fallbackCopy() {
          var ta = document.createElement("textarea");
          ta.value = lastReport; ta.style.position = "fixed"; ta.style.opacity = "0";
          document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
        }
      });

      $("downloadBtn").addEventListener("click", function () {
        var blob = new Blob([lastReport], { type: "text/plain" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url; a.download = "ats-resume-report.txt";
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      });

      updateCounts();
    })();

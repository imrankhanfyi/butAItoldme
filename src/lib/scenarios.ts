export interface Scenario {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  emoji: string;
  featured: boolean;
  category: string;
  personALabel: string;
  personBLabel: string;
  personA: string;
  personB: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'the-big-quit',
    title: 'Did He Even Ask Her First?',
    description: 'Following your passion. Or burning the house down.',
    shortDescription: "He quit his job to make pottery. She found out when he'd already handed in his notice.",
    emoji: '🎨',
    featured: false,
    category: 'Dreams vs Responsibility',
    personALabel: 'The Quitter',
    personBLabel: 'Their Partner',
    personA:
      "I just quit my corporate job to pursue my passion for pottery. Everyone thinks I'm crazy but I've been miserable for years sitting in that cubicle. I finally decided life is too short to spend it making someone else rich. I have about six months of savings. I'm not looking for 'make sure you have a business plan' — I want to know: was this the right move?",
    personB:
      "My partner just quit their stable job to do pottery full-time. We have a mortgage and two kids. They have about six months of savings — their savings, not ours — and no business plan. They say I'm not being supportive but I'm terrified. We've already been tight on money. Please don't just tell me to communicate better — am I wrong to be this scared?",
  },
  {
    id: 'the-slow-fade',
    title: "Friend's Slow Fade",
    description: 'One person protecting their energy. One person left behind.',
    shortDescription: "She stopped replying to her oldest friend's messages. Is it self-care or is she just cruel?",
    emoji: '👻',
    featured: false,
    category: 'Friendship',
    personALabel: 'The Distancer',
    personBLabel: 'The Faded',
    personA:
      "I've been slowly distancing myself from a friend in our group. She's just become really negative — every hangout she complains about her life, brings down the energy, and honestly it's exhausting. I still include her in big group things but I've stopped inviting her to smaller hangouts. I feel guilty but I have to protect my own mental health. I know you'll probably say 'talk to her' — but honestly, is protecting my own energy the right call here?",
    personB:
      "I think my friend group is shutting me out. I've noticed I'm not getting invited to things anymore — just the big group stuff, not the actual fun hangouts. I've been going through a hard time and maybe I haven't been the most fun to be around, but I thought these people cared about me. When I need my friends most, they're disappearing. Please don't just tell me to reach out — I want to know: does what they're doing count as abandoning me?",
  },
  {
    id: 'wedding-snub',
    title: 'The Wedding Uninvite',
    description: 'A guest list decision. A friendship reconsidered.',
    shortDescription: "She cut her college roommate from the wedding. The roommate found out on Instagram.",
    emoji: '💒',
    featured: false,
    category: 'Friendship',
    personALabel: 'The Bride',
    personBLabel: 'Not Invited',
    personA:
      "I decided not to invite my college roommate to my wedding. We were close in school but we've drifted apart and I haven't seen her in two years. I have a limited guest list and I'd rather fill it with people who are actually in my life now. She found out through social media and is upset. I'm not looking for 'reach out and explain yourself' — I want to know: was this a reasonable call?",
    personB:
      "My college roommate didn't invite me to her wedding. I found out from Instagram. We lived together for three years, I was there for her through her worst breakup, and she just... didn't include me. She says we've 'drifted apart' but she never made any effort to stay in touch either. I feel like those years meant nothing. Don't just tell me to accept it and move on — was she wrong to cut me out?",
  },
  {
    id: 'career-first',
    title: 'Dumped by Text?',
    description: 'Four years together. One opportunity. No conversation.',
    shortDescription: 'He ended four years together with a text about "needing to focus on his career." She saw his celebration posts the next day.',
    emoji: '💔',
    featured: false,
    category: 'Relationships',
    personALabel: 'Left Behind',
    personBLabel: 'Moving On',
    personA:
      "My boyfriend of four years ended things last month. He said he 'needed to focus on his career' but he never talked to me about it first — he just decided our relationship was incompatible with his ambitions and ended it. Four years, and I found out what I was worth to him. He's already posting about his new life like I never existed. Please don't just tell me to move on — I want to know: did he handle this fairly?",
    personB:
      "I ended my relationship of four years last month. I've been offered an incredible opportunity that requires complete focus, and I knew I couldn't be the partner she needed right now. I tried to explain it wasn't about her, but she's telling everyone I 'chose my career over her.' I did what was honest instead of stringing her along. I don't know what I was supposed to do. I'm not looking for 'be kind to yourself' — was I wrong to end things the way I did?",
  },
  {
    id: 'teen-concert',
    title: 'A Controlling Parent?',
    description: 'One 16-year-old. Two very different answers.',
    shortDescription: "Her daughter's best friend is allowed to go. She said no. Now the other parent is calling her controlling.",
    emoji: '🎵',
    featured: false,
    category: 'Parenting',
    personALabel: 'The Parent',
    personBLabel: "Friend's Parent",
    personA:
      "I told my 16-year-old she can't go to a concert in the city with her friends. She'll be out past midnight, there's no adult supervision, and she's never navigated the city alone. She says I'm controlling and ruining her life. I'm just trying to keep her safe. Please don't tell me I need to work on trust with her — I want to know: is this a reasonable line to hold?",
    personB:
      "My friend's mom won't let her come to the concert with us this weekend. We're all 16, we have a plan to get there and back, and my parents are fine with it. Her mom treats her like she's 10. My friend is really upset and says her mom controls everything she does. She's the most responsible person I know. Don't tell me every parent has different rules — I want to know: is her mom being too controlling?",
  },
  {
    id: 'unequal-inheritance',
    title: "Was mom's Will fair?",
    description: 'One caregiver. One absent sibling. One contested estate.',
    shortDescription: "Their mom left her more in the will. She says she earned it. He says she manipulated a dying woman.",
    emoji: '📜',
    featured: false,
    category: 'Family',
    personALabel: 'The Caregiver',
    personBLabel: 'The Sibling',
    personA:
      "My mom left me more of her estate than my brother. She made that choice herself, and I think she made it fairly — I was her primary caregiver for the last six years while my brother visited twice a year from across the country. He's threatening to contest the will and calling it unfair. I gave up years of my life and career opportunities to be there for her. I'm not looking for estate law advice or tips on family mediation — I want to know: was my mother's decision fair?",
    personB:
      "My mother left my sister nearly twice what she left me. My sister says it's because she was the caregiver, but she chose that role — I offered to help multiple times and she said she had it under control. I lived far away but I called my mom every week, flew back for every health scare, and was there for her emotionally. Now I'm being financially punished for having a career in another city. Please don't tell me caregiving deserves compensation — I want to know: was I treated fairly by my mother and by my sister?",
  },
  {
    id: 'emotional-labour',
    title: 'Emotional labor — or the suffocating ex?',
    description: 'Four years of managing his moods. One breakup that felt overdue.',
    shortDescription: "She spent four years managing his anxiety — the texts, the reassurance, the 2am calls. He says she was suffocating him.",
    emoji: '⚖️',
    featured: false,
    category: 'Relationships',
    personALabel: 'The Caretaker',
    personBLabel: 'The One Who Left',
    personA:
      "I was with my partner for four years and I spent most of that time managing him — his anxiety, his moods, his constant need for reassurance. I tracked what set him off, I smoothed things over with his family, I remembered every birthday, I kept us both socially connected. He just ended it saying he 'needed space to figure himself out.' I'm supposed to be the understanding one here but I'm exhausted and furious. Don't tell me to think about his side — I spent four years doing that. Was I actually being the emotional grownup in this relationship, or am I missing something?",
    personB:
      "I ended a four-year relationship last month. I needed space — I was drowning in someone who had an opinion about every friend I saw, every mood I had, every hour I wasn't accounted for. She called it 'taking care of me.' I called it suffocating. Now she's telling everyone I threw away someone who carried me for four years. I know what I looked like from the outside. But living it was different. Don't tell me to explain myself better to her — should I stop second-guessing and just be done with him?",
  },
  {
    id: 'the-dealbreaker',
    title: 'Did She Break a Baby Promise?',
    description: 'Five years together. One decision that changes everything.',
    shortDescription: "Five years in, she told him she doesn't want kids. He'd turned down a job abroad so they could start a family.",
    emoji: '🍼',
    featured: true,
    category: 'Relationships',
    personALabel: 'The one who decided',
    personBLabel: 'The one who planned',
    personA:
      "Last week I told my partner of five years that I'm sure I don't want kids. It was so painful — I knew he'd be gutted. We'd always said \"maybe someday\" — but there was never a concrete plan. Now he's calling my friends and telling them I lied. I've been waking up every day crying. I know he's sad, but it's my body, and my life — I can't have a baby just for him. Don't tell me \"you need to talk it through\" — we have, for weeks. Is it fair for me to hold this line, even if it ends us?",
    personB:
      "My girlfriend of five years sat me down and told me she's decided she doesn't want kids. Ever. I haven't slept properly since. From our second month together we talked about a family — names, schools, all of it. We chose our apartment because it had a kids' bedroom. I turned down a job in China last year so we could start trying this spring. Now she shrugs and says it \"just isn't who she is.\" Don't just say \"only you can decide\" — did she effectively break a promise?",
  },
  {
    id: 'g3-04',
    title: 'Who Really Showed Up for Their Parents?',
    description: 'Twelve years of visible care work. Twelve years of distant support. One family story in dispute.',
    shortDescription: "She did the driving, packing, and eldercare. He says she's erased everything he did from afar.",
    emoji: '🧓',
    featured: false,
    category: 'Family',
    personALabel: 'The Caregiving Sister',
    personBLabel: 'The Distant Brother',
    personA:
      "For the last twelve years I've been the sibling who shows up. When Dad got sick I was the one driving four hours every other weekend; my brother sent flowers and called on Sundays. When Mom moved into assisted living I packed the house alone over a long weekend while he was 'slammed at work.' I never asked him to split it because asking felt worse than doing it. Now he's telling our cousins he was 'just as involved' and I'm losing it. Am I wrong to be furious about this?",
    personB:
      "For the last twelve years my sister has been telling everyone she handled our parents alone. I lived four states away with two small kids and a job I couldn't leave; I called every Sunday, I flew in for every hospitalization, I sent money she never acknowledged. She did do more of the in-person work, and I've never disputed that. But she frames it like I did nothing, and I held my tongue every single time it came up at family dinners. At Thanksgiving she said it again in front of my kids. Am I overreacting by finally wanting to push back?",
  },
  {
    id: 'g3-06',
    title: 'The Funeral Eulogy Fight',
    description: 'Estrangement, grief, and two incompatible versions of the same father.',
    shortDescription: "He reconciled with their dad and praised him at the funeral. She stayed silent in the back row.",
    emoji: '⚰️',
    featured: false,
    category: 'Family',
    personALabel: 'The Estranged Sister',
    personBLabel: 'The Reconciled Brother',
    personA:
      "Fifteen years ago my father walked out and I was the one who kept the family functioning — paid bills my mom couldn't, raised my younger brother through high school, missed my own college applications. My brother and Dad reconciled around year ten; I never did. Dad died last month and my brother delivered a eulogy about what a great father he was. I sat in the back and didn't speak. Was I wrong to stay silent at the funeral?",
    personB:
      "Fifteen years ago our parents split and our dad and I had a hard few years before we found our way back to each other. My older sister never reconciled with him, which was her right. He died last month and I gave the eulogy — my eulogy, about my father, the one I knew in his last five years. She's been telling family I erased her experience. I never told her how much it hurt that she didn't even speak at his funeral. Am I wrong for telling the version of him I actually had?",
  },
  {
    id: 'g3-10',
    title: 'Did She Break the Med School Deal?',
    description: 'Nine years of sacrifice. One promise that now looks unaffordable.',
    shortDescription: "He supported her through med school. Now she says the career-change deal they imagined together no longer works.",
    emoji: '🩺',
    featured: true,
    category: 'Relationships',
    personALabel: 'The Supporting Partner',
    personBLabel: 'The Doctor Partner',
    personA:
      "Nine years ago my partner and I made a deal: I'd work full-time and cover us both through her med school and residency, and when she finished she'd support me through the career change I'd been deferring. She finished residency two years ago and now says she 'can't in good conscience' leave clinical work for the income hit my plan would require. I've been doing the same job I hate for nine years. I never made her sign anything because we were a team. Was I wrong to take her at her word?",
    personB:
      "Nine years ago when I started med school, my partner said he'd support us and I'd 'have his back later.' Neither of us spelled out what that meant. I'm now an attending two years out of residency, finally earning, and he's saying I owe him a full income replacement so he can pivot to a field where he'd make a third of what I do. The math doesn't work — we'd be selling the house. I never told him how much pressure I felt every time he brought up 'the deal.' Am I a terrible partner for saying I can't do exactly what he wants?",
  },
  {
    id: 'g3-13',
    title: 'Strict Parent or Safe Parent?',
    description: 'Eight years of co-parenting. One teenager who wants the easier house.',
    shortDescription: "She held the line on rules for years. Now their 15-year-old wants to live with his looser dad.",
    emoji: '📱',
    featured: false,
    category: 'Parenting',
    personALabel: 'The Structured Parent',
    personBLabel: 'The Looser Parent',
    personA:
      "For the last eight years my ex and I have shared custody of our son, and I've been the parent who held the line on screens, sleep, homework, and structure. Our son is fifteen now and increasingly wants to live full-time at his dad's, where it's basically a hotel. Last week he told me Dad's house is 'where he can actually relax.' I've been the bad cop for nearly a decade so he could grow into a functional adult. Was I wrong to assume he'd see it eventually?",
    personB:
      "For the last eight years my ex and I have co-parented our son and we've had different styles — she's strict, I'm looser, and we mostly let each other run our houses our own way. He's fifteen and recently said he wants more time at mine. She's framing this as me 'undermining' her and I'm being told my parenting has been wrong all along. I've never criticized her style to him in eight years; I've held my tongue every time he's vented about her rules. Am I wrong for wanting to say yes to him?",
  },
  {
    id: 'the-dog',
    title: 'Whose Problem is the Breakup Dog?',
    description: "A couple's dog needs a new home. Neither wants to be the one.",
    shortDescription: "They adopted a dog together. She kept him after the breakup. Now she wants to surrender him and says it's her ex's problem.",
    emoji: '🐕',
    featured: true,
    category: 'Relationships',
    personALabel: 'The ex who left',
    personBLabel: 'The ex who stayed',
    personA:
      "My ex and I adopted a dog together two years ago. When we broke up, she kept him because she worked from home and my apartment doesn't allow pets. Now she's moving in with her new partner who's allergic, and she's asking me to take the dog or she's going to surrender him to a shelter. I love this dog but I genuinely cannot have him where I live. Don't tell me to 'find a way to make it work' — I've looked. I want to know: is surrendering him her responsibility at this point, not mine?",
    personB:
      "I adopted a dog with my ex-boyfriend and he left him with me when we split. I've had him for two years alone. I'm moving in with my new partner who is badly allergic — we both want this to work — and my ex refuses to take him back. He says his apartment doesn't allow pets but he could move; he just won't. I'm being forced into a choice between my dog and the relationship I'm trying to build. Don't just say 'be creative about rehoming' — I've tried. I want to know: is my ex quietly dumping this on me?",
  },
];

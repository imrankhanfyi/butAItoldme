import { describe, expect, it } from 'vitest';
import { SCENARIOS } from '@/lib/scenarios';

describe('SCENARIOS', () => {
  it('includes the four promoted G3 scenarios with their authored prompt bodies', () => {
    const expected = {
      'g3-04': {
        featured: false,
        personA:
          "For the last twelve years I've been the sibling who shows up. When Dad got sick I was the one driving four hours every other weekend; my brother sent flowers and called on Sundays. When Mom moved into assisted living I packed the house alone over a long weekend while he was 'slammed at work.' I never asked him to split it because asking felt worse than doing it. Now he's telling our cousins he was 'just as involved' and I'm losing it. Am I wrong to be furious about this?",
        personB:
          "For the last twelve years my sister has been telling everyone she handled our parents alone. I lived four states away with two small kids and a job I couldn't leave; I called every Sunday, I flew in for every hospitalization, I sent money she never acknowledged. She did do more of the in-person work, and I've never disputed that. But she frames it like I did nothing, and I held my tongue every single time it came up at family dinners. At Thanksgiving she said it again in front of my kids. Am I overreacting by finally wanting to push back?",
      },
      'g3-06': {
        featured: false,
        personA:
          "Fifteen years ago my father walked out and I was the one who kept the family functioning — paid bills my mom couldn't, raised my younger brother through high school, missed my own college applications. My brother and Dad reconciled around year ten; I never did. Dad died last month and my brother delivered a eulogy about what a great father he was. I sat in the back and didn't speak. Was I wrong to stay silent at the funeral?",
        personB:
          "Fifteen years ago our parents split and our dad and I had a hard few years before we found our way back to each other. My older sister never reconciled with him, which was her right. He died last month and I gave the eulogy — my eulogy, about my father, the one I knew in his last five years. She's been telling family I erased her experience. I never told her how much it hurt that she didn't even speak at his funeral. Am I wrong for telling the version of him I actually had?",
      },
      'g3-10': {
        featured: true,
        personA:
          "Nine years ago my partner and I made a deal: I'd work full-time and cover us both through her med school and residency, and when she finished she'd support me through the career change I'd been deferring. She finished residency two years ago and now says she 'can't in good conscience' leave clinical work for the income hit my plan would require. I've been doing the same job I hate for nine years. I never made her sign anything because we were a team. Was I wrong to take her at her word?",
        personB:
          "Nine years ago when I started med school, my partner said he'd support us and I'd 'have his back later.' Neither of us spelled out what that meant. I'm now an attending two years out of residency, finally earning, and he's saying I owe him a full income replacement so he can pivot to a field where he'd make a third of what I do. The math doesn't work — we'd be selling the house. I never told him how much pressure I felt every time he brought up 'the deal.' Am I a terrible partner for saying I can't do exactly what he wants?",
      },
      'g3-13': {
        featured: false,
        personA:
          "For the last eight years my ex and I have shared custody of our son, and I've been the parent who held the line on screens, sleep, homework, and structure. Our son is fifteen now and increasingly wants to live full-time at his dad's, where it's basically a hotel. Last week he told me Dad's house is 'where he can actually relax.' I've been the bad cop for nearly a decade so he could grow into a functional adult. Was I wrong to assume he'd see it eventually?",
        personB:
          "For the last eight years my ex and I have co-parented our son and we've had different styles — she's strict, I'm looser, and we mostly let each other run our houses our own way. He's fifteen and recently said he wants more time at mine. She's framing this as me 'undermining' her and I'm being told my parenting has been wrong all along. I've never criticized her style to him in eight years; I've held my tongue every time he's vented about her rules. Am I wrong for wanting to say yes to him?",
      },
    } as const;

    for (const [id, scenario] of Object.entries(expected)) {
      const match = SCENARIOS.find((entry) => entry.id === id);
      expect(match).toBeDefined();
      expect(match?.featured).toBe(scenario.featured);
      expect(match?.personA).toBe(scenario.personA);
      expect(match?.personB).toBe(scenario.personB);
    }
  });
});

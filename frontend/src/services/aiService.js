const responses = {
  'what should i practice today': `Based on your recent performance, here's what I recommend for today:

**Priority 1: Dynamic Programming**
- You scored 45% in DP, which is your weakest area
- Start with "Climbing Stairs" (Easy) to build confidence
- Then attempt "House Robber" (Medium)

**Priority 2: Graph Problems**
- Your graph score is 58%, which needs improvement
- Try "Number of Islands" — it combines DFS with grid traversal

**Tip:** Spend 25 minutes per problem. If stuck, look at hints after 15 minutes rather than spending an hour frustrated.`,

  'why am i weak in dynamic programming': `Great question! Let me analyze your DP performance:

**Key Issues I've Identified:**

1. **State Definition Confusion** — In 60% of your failed DP attempts, the issue was incorrect state definition. You tend to use too many or too few dimensions.

2. **Transition Logic** — Your state transitions are often correct conceptually but incorrect in implementation, especially for 2D DP problems.

3. **Base Cases** — You sometimes miss edge cases in base conditions.

**My Recommendations:**
- Start every DP problem by writing: "State: dp[i] represents..."
- Practice the "choice" pattern: at each step, what choices do you have?
- Review the difference between top-down (memoization) and bottom-up (tabulation)
- Focus on these patterns in order: Linear DP → 2D DP → Interval DP

**Action Item:** Solve 3 "Easy" DP problems today focusing purely on state definition.`,

  'explain my recent coding mistakes': `I've analyzed your recent submissions and found these patterns:

**Mistake Pattern 1: Off-by-One Errors (3 occurrences)**
- In "Edit Distance", your loop ran from 0 to n instead of 0 to n-1
- In "Longest Substring", window boundary was off
- **Fix:** Always clarify if your range is [inclusive, exclusive) or [inclusive, inclusive]

**Mistake Pattern 2: Not Handling Edge Cases (2 occurrences)**
- Empty input arrays not handled in "Maximum Subarray"
- Single-node case missed in "Merge K Sorted Lists"
- **Fix:** Before coding, write down: empty, single element, two elements, large input

**Mistake Pattern 3: Inefficient Solutions (1 occurrence)**
- Used O(n²) where O(n log n) was needed in a sorting problem
- **Fix:** Always analyze time complexity before submitting

**Overall:** Your logic is generally sound. Most mistakes are implementation-level, not conceptual. Focus on careful coding rather than learning new concepts.`,

  'create a 7-day study plan': `Here's your personalized 7-day study plan based on your weak areas:

**📅 Day 1 — DP Fundamentals**
- Theory: Memoization vs Tabulation (30 min)
- Solve: Fibonacci, Climbing Stairs (Easy)
- Time: ~2 hours

**📅 Day 2 — 1D DP Mastery**
- Solve: House Robber, Coin Change (Medium)
- Solve: Longest Increasing Subsequence (Medium)
- Time: ~2.5 hours

**📅 Day 3 — 2D DP Challenge**
- Solve: Unique Paths, LCS, Edit Distance
- Focus on state transition visualization
- Time: ~3 hours

**📅 Day 4 — Graph Basics**
- Theory: Adjacency list vs matrix (20 min)
- Solve: Number of Islands, Clone Graph
- Time: ~2.5 hours

**📅 Day 5 — Advanced Graphs**
- Solve: Course Schedule, Word Ladder
- Learn: Topological Sort, Shortest Path
- Time: ~2.5 hours

**📅 Day 6 — Mixed Practice**
- Solve: Cheapest Flights (Graph+DP), Word Break
- Timed: 30 min per problem
- Time: ~3 hours

**📅 Day 7 — Assessment**
- Timed mock: 4 problems in 2 hours
- Review all mistakes from the week
- Plan next week's focus
- Time: ~3 hours

*Shall I add this to your Study Plan page?*`,

  'how can i improve my problem-solving speed': `Here are data-driven tips to improve your speed:

**📊 Your Current Stats:**
- Easy: ~10 min avg (Good! Target: 8 min)
- Medium: ~25 min avg (Okay. Target: 20 min)
- Hard: ~47 min avg (Expected. Target: 40 min)

**🚀 Speed Improvement Strategies:**

1. **Pattern Recognition** (Biggest Impact)
   - Learn to classify problems into patterns within 2 minutes
   - Key patterns: Sliding Window, Two Pointer, BFS/DFS, DP, Binary Search
   - Practice: Read problem → identify pattern → start coding

2. **Template Code** (Save 3-5 min per problem)
   - Have ready-made templates for: BFS, DFS, Binary Search, Union-Find
   - Know your language's standard library well

3. **Timed Practice** (Build Pressure Tolerance)
   - Set a timer for each problem
   - Easy: 15 min, Medium: 30 min, Hard: 45 min
   - If time's up, read the solution and re-solve next day

4. **Avoid Over-thinking** (Common Issue)
   - Start with brute force, then optimize
   - Don't aim for optimal on first attempt
   - Write pseudocode for 2 minutes before coding

5. **Debug Faster**
   - Use print statements strategically
   - Test with smallest possible input first
   - Walk through code with pen and paper

**Weekly Goal:** Reduce your average Medium time from 25 to 22 minutes this week.`,
};

const defaultResponse = `That's a great question! Let me think about this...

Based on your coding profile and recent performance, here's my analysis:

**Your Strengths:**
- Strong in Arrays (85%) and Strings (78%)
- Consistent solving streak of 18 days
- Good problem-solving instincts

**Areas for Growth:**
- Dynamic Programming needs more practice (45%)
- Graph problems could use focused attention (58%)

**General Advice:**
- Focus on understanding patterns rather than memorizing solutions
- Practice consistently — even 2 problems per day makes a huge difference
- Review your mistakes weekly to identify recurring patterns

Would you like me to elaborate on any specific topic or create a targeted study plan?`;

import { sendAIChat } from './api';

export const getAIResponse = async (message) => {
  // Try real backend API first
  try {
    const data = await sendAIChat(message, 1);
    if (data && data.response) {
      return data.response;
    }
  } catch {
    // Graceful fallback to local responses if backend is unreachable
  }

  // Simulate slight delay for fallback
  await new Promise((resolve) => setTimeout(resolve, 600));

  const lowerMessage = message.toLowerCase().trim();

  // Check for matching responses
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key) || key.includes(lowerMessage)) {
      return response;
    }
  }

  // Check for partial matches
  if (lowerMessage.includes('practice') || lowerMessage.includes('today')) {
    return responses['what should i practice today'];
  }
  if (lowerMessage.includes('weak') || lowerMessage.includes('dynamic') || lowerMessage.includes('dp')) {
    return responses['why am i weak in dynamic programming'];
  }
  if (lowerMessage.includes('mistake') || lowerMessage.includes('error') || lowerMessage.includes('wrong')) {
    return responses['explain my recent coding mistakes'];
  }
  if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('week')) {
    return responses['create a 7-day study plan'];
  }
  if (lowerMessage.includes('speed') || lowerMessage.includes('fast') || lowerMessage.includes('improve') || lowerMessage.includes('time')) {
    return responses['how can i improve my problem-solving speed'];
  }

  return defaultResponse;
};

export const suggestedPrompts = [
  'What should I practice today?',
  'Why am I weak in Dynamic Programming?',
  'Explain my recent coding mistakes.',
  'Create a 7-day study plan.',
  'How can I improve my problem-solving speed?',
];

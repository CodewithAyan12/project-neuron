export const userData = {
  name: 'Ayan Sharma',
  email: 'demo@neuron.ai',
  avatar: null,
  college: 'University of Technology',
  degree: 'B.Tech Information Technology',
  year: '4th Year',
  bio: 'Passionate about algorithms and competitive programming.',
  joinedDate: '2025-06-15',
  goals: ['Master Dynamic Programming', 'Solve 500 problems', 'Crack FAANG interviews', 'Learn System Design'],
  strengths: ['Arrays', 'Strings', 'Hash Tables', 'Sorting'],
  weakAreas: ['Dynamic Programming', 'Graphs', 'Trees'],
};

export const dashboardStats = {
  problemsSolved: 128,
  currentStreak: 18,
  confidenceScore: 82,
  weakestTopic: 'Dynamic Programming',
};

export const todaysMissions = [
  { id: 1, task: 'Solve 2 Graph Problems', completed: false, type: 'practice' },
  { id: 2, task: 'Review Dynamic Programming', completed: false, type: 'review' },
  { id: 3, task: "Complete today's AI Mentor session", completed: false, type: 'mentor' },
];

export const topicPerformance = [
  { topic: 'Arrays', score: 85, color: '#10b981' },
  { topic: 'Strings', score: 78, color: '#3b82f6' },
  { topic: 'Linked List', score: 72, color: '#8b5cf6' },
  { topic: 'Trees', score: 65, color: '#f59e0b' },
  { topic: 'Graphs', score: 58, color: '#ef4444' },
  { topic: 'Dynamic Programming', score: 45, color: '#ef4444' },
];

export const codingActivity = [
  { day: 'Mon', problems: 5 },
  { day: 'Tue', problems: 3 },
  { day: 'Wed', problems: 7 },
  { day: 'Thu', problems: 4 },
  { day: 'Fri', problems: 6 },
  { day: 'Sat', problems: 8 },
  { day: 'Sun', problems: 2 },
];

// Weekly coding activity for analytics (last 8 weeks)
export const weeklyCodingActivity = [
  { week: 'W1', problems: 18 },
  { week: 'W2', problems: 22 },
  { week: 'W3', problems: 15 },
  { week: 'W4', problems: 28 },
  { week: 'W5', problems: 20 },
  { week: 'W6', problems: 25 },
  { week: 'W7', problems: 30 },
  { week: 'W8', problems: 24 },
];

export const aiInsight = "You are performing well in Arrays and Strings, but your recent mistakes show difficulty with Dynamic Programming state transitions. I recommend focusing on 2D DP before moving to advanced Graph problems.";

export const recentActivity = [
  { id: 1, title: 'Two Sum', platform: 'LeetCode', difficulty: 'Easy', status: 'Solved', time: '12 min', date: '2026-10-08' },
  { id: 2, title: 'Longest Substring Without Repeating Characters', platform: 'LeetCode', difficulty: 'Medium', status: 'Solved', time: '25 min', date: '2026-10-08' },
  { id: 3, title: 'Merge K Sorted Lists', platform: 'LeetCode', difficulty: 'Hard', status: 'Attempted', time: '45 min', date: '2026-10-07' },
  { id: 4, title: 'Coin Change', platform: 'LeetCode', difficulty: 'Medium', status: 'Solved', time: '30 min', date: '2026-10-07' },
  { id: 5, title: 'Valid Parentheses', platform: 'LeetCode', difficulty: 'Easy', status: 'Solved', time: '8 min', date: '2026-10-06' },
];

export const recommendedProblems = [
  { id: 1, title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', platform: 'LeetCode' },
  { id: 2, title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', platform: 'LeetCode' },
  { id: 3, title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', platform: 'LeetCode' },
  { id: 4, title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', platform: 'LeetCode' },
];

export const defaultProblems = [
  { id: '1', title: 'Two Sum', platform: 'LeetCode', topic: 'Arrays', difficulty: 'Easy', language: 'Python', timeTaken: '12', notes: 'Used hash map approach', status: 'Solved', date: '2026-10-08' },
  { id: '2', title: 'Longest Substring Without Repeating Characters', platform: 'LeetCode', topic: 'Strings', difficulty: 'Medium', language: 'JavaScript', timeTaken: '25', notes: 'Sliding window technique', status: 'Solved', date: '2026-10-08' },
  { id: '3', title: 'Merge K Sorted Lists', platform: 'LeetCode', topic: 'Linked List', difficulty: 'Hard', language: 'C++', timeTaken: '45', notes: 'Used min-heap. Need to review merge approach.', status: 'Attempted', date: '2026-10-07' },
  { id: '4', title: 'Coin Change', platform: 'LeetCode', topic: 'Dynamic Programming', difficulty: 'Medium', language: 'Python', timeTaken: '30', notes: 'Bottom-up DP approach', status: 'Solved', date: '2026-10-07' },
  { id: '5', title: 'Valid Parentheses', platform: 'LeetCode', topic: 'Strings', difficulty: 'Easy', language: 'Java', timeTaken: '8', notes: 'Stack-based solution', status: 'Solved', date: '2026-10-06' },
  { id: '6', title: 'Binary Tree Level Order Traversal', platform: 'LeetCode', topic: 'Trees', difficulty: 'Medium', language: 'Python', timeTaken: '20', notes: 'BFS with queue', status: 'Solved', date: '2026-10-06' },
  { id: '7', title: 'Number of Islands', platform: 'LeetCode', topic: 'Graphs', difficulty: 'Medium', language: 'Python', timeTaken: '22', notes: 'DFS flood fill', status: 'Solved', date: '2026-10-05' },
  { id: '8', title: 'Edit Distance', platform: 'LeetCode', topic: 'Dynamic Programming', difficulty: 'Hard', language: 'C++', timeTaken: '50', notes: 'Classic 2D DP. Still shaky on state transitions.', status: 'Attempted', date: '2026-10-05' },
  { id: '9', title: 'Maximum Subarray', platform: 'LeetCode', topic: 'Arrays', difficulty: 'Medium', language: 'Python', timeTaken: '15', notes: "Kadane's algorithm", status: 'Solved', date: '2026-10-04' },
  { id: '10', title: 'Word Search', platform: 'LeetCode', topic: 'Graphs', difficulty: 'Medium', language: 'Java', timeTaken: '35', notes: 'Backtracking DFS', status: 'Solved', date: '2026-10-04' },
];

export const defaultStudyPlan = [
  {
    day: 1,
    title: 'Dynamic Programming Basics',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    estimatedTime: '2 hours',
    description: 'Learn the fundamentals of Dynamic Programming: overlapping subproblems and optimal substructure.',
    tasks: [
      { id: 'dp1-1', text: 'Read about memoization vs tabulation', completed: false },
      { id: 'dp1-2', text: 'Solve: Fibonacci Number', completed: false },
      { id: 'dp1-3', text: 'Solve: Climbing Stairs', completed: false },
      { id: 'dp1-4', text: 'Review: When to use DP vs Greedy', completed: false },
    ],
  },
  {
    day: 2,
    title: '1D Dynamic Programming',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    estimatedTime: '2.5 hours',
    description: 'Master 1D DP patterns: linear sequences, decision-making problems.',
    tasks: [
      { id: 'dp2-1', text: 'Solve: House Robber', completed: false },
      { id: 'dp2-2', text: 'Solve: Coin Change', completed: false },
      { id: 'dp2-3', text: 'Solve: Longest Increasing Subsequence', completed: false },
      { id: 'dp2-4', text: 'Practice: Identify state and transition', completed: false },
    ],
  },
  {
    day: 3,
    title: '2D Dynamic Programming',
    topic: 'Dynamic Programming',
    difficulty: 'Hard',
    estimatedTime: '3 hours',
    description: 'Tackle 2D DP problems: grids, string matching, and multi-dimensional states.',
    tasks: [
      { id: 'dp3-1', text: 'Solve: Unique Paths', completed: false },
      { id: 'dp3-2', text: 'Solve: Longest Common Subsequence', completed: false },
      { id: 'dp3-3', text: 'Solve: Edit Distance', completed: false },
      { id: 'dp3-4', text: 'Review 2D state transition patterns', completed: false },
    ],
  },
  {
    day: 4,
    title: 'Graph Traversal',
    topic: 'Graphs',
    difficulty: 'Medium',
    estimatedTime: '2.5 hours',
    description: 'Learn graph representations and basic traversal algorithms.',
    tasks: [
      { id: 'g4-1', text: 'Review adjacency list vs matrix', completed: false },
      { id: 'g4-2', text: 'Solve: Number of Islands', completed: false },
      { id: 'g4-3', text: 'Solve: Clone Graph', completed: false },
      { id: 'g4-4', text: 'Practice: Implement DFS and BFS from scratch', completed: false },
    ],
  },
  {
    day: 5,
    title: 'BFS and DFS',
    topic: 'Graphs',
    difficulty: 'Medium',
    estimatedTime: '2.5 hours',
    description: 'Deep dive into BFS and DFS patterns for complex graph problems.',
    tasks: [
      { id: 'g5-1', text: 'Solve: Course Schedule (Topological Sort)', completed: false },
      { id: 'g5-2', text: 'Solve: Word Ladder (BFS)', completed: false },
      { id: 'g5-3', text: 'Solve: Pacific Atlantic Water Flow', completed: false },
      { id: 'g5-4', text: 'Review: BFS vs DFS use cases', completed: false },
    ],
  },
  {
    day: 6,
    title: 'Mixed Practice',
    topic: 'Mixed',
    difficulty: 'Medium',
    estimatedTime: '3 hours',
    description: 'Combine DP and Graph skills with mixed-difficulty problems.',
    tasks: [
      { id: 'mx6-1', text: 'Solve: Cheapest Flights Within K Stops (Graph + DP)', completed: false },
      { id: 'mx6-2', text: 'Solve: Word Break (DP)', completed: false },
      { id: 'mx6-3', text: 'Solve: Network Delay Time (Dijkstra)', completed: false },
      { id: 'mx6-4', text: 'Review all mistakes from this week', completed: false },
    ],
  },
  {
    day: 7,
    title: 'Revision + Assessment',
    topic: 'Mixed',
    difficulty: 'Hard',
    estimatedTime: '3 hours',
    description: 'Final revision day. Assess your progress with timed challenges.',
    tasks: [
      { id: 'rv7-1', text: 'Timed challenge: 2 DP problems in 40 minutes', completed: false },
      { id: 'rv7-2', text: 'Timed challenge: 2 Graph problems in 40 minutes', completed: false },
      { id: 'rv7-3', text: 'Review weak areas identified this week', completed: false },
      { id: 'rv7-4', text: 'Plan next week with AI Mentor', completed: false },
    ],
  },
];

export const difficultyDistribution = [
  { name: 'Easy', value: 45, color: '#10b981' },
  { name: 'Medium', value: 62, color: '#f59e0b' },
  { name: 'Hard', value: 21, color: '#ef4444' },
];

export const analyticsStats = {
  problemsSolved: 128,
  avgSolveTime: '22 min',
  currentStreak: 18,
  successRate: '84%',
};

export const weakAreas = [
  { topic: 'Dynamic Programming', score: 45, suggestion: 'Focus on state transition identification and 2D DP patterns.' },
  { topic: 'Graphs', score: 58, suggestion: 'Practice BFS/DFS traversals and topological sorting.' },
  { topic: 'Trees', score: 65, suggestion: 'Work on tree traversals and BST operations.' },
];

export const aiLearningInsights = [
  'Your solving speed for Easy problems has improved by 30% this month.',
  'You tend to struggle with problems requiring 2D DP state transitions.',
  'Your Graph traversal skills are improving — consider tackling shortest-path problems.',
  'You perform best in morning sessions. Consider scheduling harder problems then.',
  'Reviewing problems 24 hours after solving them can improve retention by 40%.',
];

export const platforms = ['LeetCode', 'HackerRank', 'CodeForces', 'CodeChef', 'GeeksforGeeks', 'AtCoder'];
export const topics = ['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Hash Tables', 'Sorting', 'Binary Search', 'Stack', 'Queue', 'Heap', 'Backtracking', 'Greedy', 'Math'];
export const difficulties = ['Easy', 'Medium', 'Hard'];
export const languages = ['Python', 'JavaScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'TypeScript'];
export const statuses = ['Solved', 'Attempted', 'Revisit'];

export interface CSFundamentalTopic {
  slug: string;
  title: string;
  headingPrefix?: string;
  headingHighlight?: string;
  shortName: string;
  description: string;
  image: string;
  href: string;
  status: "ready" | "coming-soon";
  statusLabel: string;
  pdfUrl?: string;
  topmateUrl?: string;
  topicsCovered: string[];
  keyQuestions?: string[];
}

export const CS_FUNDAMENTALS_TOPICS: CSFundamentalTopic[] = [
  {
    slug: "operating-system",
    title: "Operating System",
    headingPrefix: "Operating",
    headingHighlight: "System",
    shortName: "OS",
    description: "Operating system notes, specially designed for tech interview preparation 🚀",
    image: "/images/cs-fundamentals/operating-system.png",
    href: "/cs-fundamentals/operating-system",
    status: "ready",
    statusLabel: "PDF Notes Ready",
    pdfUrl: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/notes/operating-system-notes-web.pdf",
    topmateUrl: "https://topmate.io/abhinavawasthi/918228",
    topicsCovered: [
      "Processes, Threads & Multithreading",
      "CPU Scheduling Algorithms (FCFS, SJF, RR, Priority)",
      "Process Synchronization (Mutex, Semaphores, Monitors)",
      "Deadlocks: Detection, Prevention & Banker's Algorithm",
      "Memory Management, Paging, Segmentation & Virtual Memory",
      "Page Replacement Policies (LRU, FIFO, Optimal)",
      "File Systems, Inodes & Disk Scheduling",
    ],
    keyQuestions: [
      "Difference between Process and Thread?",
      "What are Deadlock conditions and how to prevent them?",
      "Explain Virtual Memory and Demand Paging.",
      "What is Thrashing and how do you resolve it?",
      "Mutex vs Binary Semaphore differences?",
    ],
  },
  {
    slug: "oops",
    title: "Object Oriented Programming",
    headingPrefix: "Object Oriented",
    headingHighlight: "Programming",
    shortName: "OOPS",
    description: "OOPs notes, specially designed for tech interview preparation 🚀",
    image: "/images/cs-fundamentals/oops.png",
    href: "/cs-fundamentals/oops",
    status: "ready",
    statusLabel: "PDF Notes Ready",
    pdfUrl: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/notes/oops-notes-web.pdf",
    topmateUrl: "https://topmate.io/abhinavawasthi/918265",
    topicsCovered: [
      "4 Pillars of OOP: Encapsulation, Abstraction, Inheritance, Polymorphism",
      "Compile-time vs Run-time Polymorphism (Method Overloading vs Overriding)",
      "Virtual Functions, VTABLE & VPTR Mechanism",
      "Abstract Classes vs Interfaces",
      "SOLID Principles & Design Patterns (Singleton, Factory, Observer)",
      "Constructors, Destructors, Copy Constructors & Deep/Shallow Copy",
      "Diamond Problem & Multiple Inheritance Handling",
    ],
    keyQuestions: [
      "Explain the 4 pillars of OOP with real-world examples.",
      "How does the VTABLE work in C++ for virtual functions?",
      "What is the difference between Abstract Class and Interface?",
      "Explain SOLID principles in simple words.",
      "What is the Diamond Problem and how is it solved?",
    ],
  },
  {
    slug: "dbms",
    title: "Database Management System",
    headingPrefix: "Database Management",
    headingHighlight: "System",
    shortName: "DBMS",
    description: "DBMS notes, specially designed for tech interview preparation 🚀",
    image: "/images/cs-fundamentals/dbms.png",
    href: "/cs-fundamentals/dbms",
    status: "ready",
    statusLabel: "PDF Notes Ready",
    pdfUrl: "https://zettllhfmtvcunctalyo.supabase.co/storage/v1/object/public/resources/notes/dbms-notes-web.pdf",
    topmateUrl: "https://topmate.io/abhinavawasthi/918246",
    topicsCovered: [
      "Relational Model & Relational Algebra",
      "ER Modeling & Schema Design",
      "ACID Properties & Transaction States",
      "Normalization: 1NF, 2NF, 3NF, BCNF with decomposition examples",
      "Indexing Techniques: Clustered vs Non-clustered, B-Tree, B+ Tree",
      "Concurrency Control: 2PL (Two-Phase Locking), Timestamp Ordering, Multiversion",
      "Deadlocks in Databases & Recovery Mechanisms (WAL, ARIES)",
    ],
    keyQuestions: [
      "What are ACID properties? Explain with a banking transfer example.",
      "Why are B+ Trees preferred over B-Trees for database indexing?",
      "Difference between Clustered and Non-Clustered index?",
      "Explain 3NF vs BCNF normalization with examples.",
      "What is Two-Phase Locking (2PL) and Strict 2PL?",
    ],
  },
  {
    slug: "computer-networks",
    title: "Computer Networks",
    headingPrefix: "Computer",
    headingHighlight: "Networks",
    shortName: "CN",
    description: "Computer networks notes, specially designed for tech interview preparation 🚀",
    image: "/images/cs-fundamentals/computer-networks.png",
    href: "/cs-fundamentals/computer-networks",
    status: "coming-soon",
    statusLabel: "In Active Development",
    topicsCovered: [
      "OSI 7-Layer Model & TCP/IP Model",
      "TCP vs UDP: 3-Way Handshake, Connection Teardown, Flow Control & Congestion Control",
      "DNS Resolution: Recursive vs Iterative Lookups",
      "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)",
      "IP Addressing, Subnetting, CIDR & NAT",
      "Routing Algorithms: Distance Vector, Link State, BGP & OSPF",
      "Network Security: SSL/TLS Handshake, Symmetric vs Asymmetric Encryption",
    ],
  },
  {
    slug: "sql",
    title: "Structured Query Language (SQL)",
    headingPrefix: "Structured Query",
    headingHighlight: "Language (SQL)",
    shortName: "SQL",
    description: "SQL interview master notes, complex queries, window functions and schema design 🚀",
    image: "/images/cs-fundamentals/sql.png",
    href: "/cs-fundamentals/sql",
    status: "coming-soon",
    statusLabel: "In Active Development",
    topicsCovered: [
      "SQL Query Execution Order",
      "Complex Joins: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF",
      "Window Functions: ROW_NUMBER(), RANK(), DENSE_RANK(), NTILE(), LAG(), LEAD()",
      "Correlated vs Non-correlated Subqueries",
      "Aggregations: GROUP BY, HAVING, GROUPING SETS",
      "Views, Stored Procedures, Triggers & CTEs (Common Table Expressions)",
      "Query Optimization & Index-guided Execution Plans",
    ],
  },
  {
    slug: "dsa",
    title: "DSA Theory Questions",
    headingPrefix: "DSA Theory",
    headingHighlight: "Questions",
    shortName: "DSA Theory",
    description: "Algorithmic complexity, amortized runtime, proofs and theoretical interview questions 🚀",
    image: "/images/cs-fundamentals/dsa-theory.png",
    href: "/cs-fundamentals/dsa",
    status: "coming-soon",
    statusLabel: "In Active Development",
    topicsCovered: [
      "Asymptotic Analysis (Big-O, Big-Omega, Big-Theta)",
      "Master Theorem & Recursion Tree Solving",
      "Amortized Analysis (Aggregate, Accounting, Potential Method)",
      "Array vs Linked List Internal Memory Layout & Cache Locality",
      "Hash Collision Resolution: Chaining vs Open Addressing (Linear/Quadratic/Double)",
      "Graph Traversal Complexities & Topological Sorting Proofs",
      "Dynamic Programming: Optimal Substructure & Overlapping Subproblems",
    ],
  },
];

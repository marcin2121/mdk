# 🤝 Contributing to MDK

Thank you for your interest in contributing to MDK! We welcome contributions from developers, designers, and testers to make this Next.js Setup Wizard the best it can be.

---

## 🚀 Getting Started

1. **Fork the repository** on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/marcin2121/mdk.git
   cd mdk
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Run in development mode**:
   ```bash
   npm run dev
   ```
   *Visit \`http://localhost:3000\` to start the Setup Wizard interceptor.*

---

## 🛠️ Development Guidelines

To ensure smooth pull requests and maintainable architecture, please follow these guidelines:

### 1. **Typescript & Safety**
- Avoid using `any` typecasting whenever possible. Use strictly typed node interfaces in `lib/types/builder.ts`.
- Maintain correct references to `CONTAINER_TYPES` instead of hardcoding component type definitions.

### 2. **State & Immutability**
- State updates inside `useBuilderStore` must **always** prioritize immutability (`structuredClone`). Do not mutate past/future arrays or node objects directly prior to setting values.
- Respect the **50-step history limit** to prevent bloated undo/redo stacks (\`past: [...state.past.slice(-49), structuredClone(state.nodes)]\`).

### 3. **English First**
- Code comments, console logs, and UI labels must be written in **English**.
- Polish strings go exclusively into dictionary lookup keys inside `lib/translations.ts` file structures for i18n support workflows.

---

## 🧪 Testing

Before submitting a Pull Request, ensure that:
1. **Linter satisfies requirements**:
   ```bash
   npm run lint
   ```
2. **Build completes successfully**:
   ```bash
   npm run build
   ```
3. **Unit tests pass**:
   ```bash
   npm run test
   ```

---

## 📩 Submitting a Pull Request

1. Create a descriptive branch for your feature (\`git checkout -b feature/cool-feature\`).
2. Commit your changes with clear messages (\`git commit -m "feat: Add dynamic nodes parser"\`).
3. Push to your fork (\`git push origin feature/cool-feature\`).
4. Open a **Pull Request** to the \`main\` branch.

All code will be verified by automated GitHub Actions CI. Godspeed Architect.

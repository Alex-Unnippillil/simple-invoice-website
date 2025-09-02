export default {
  "*": (files) => {
    const allowed = files.filter((f) =>
      /\.(js|json|mjs|cjs|ts|tsx|jsx|md)$/i.test(f),
    );
    const commands = ["npm run lint"];
    if (allowed.length) {
      commands.push(`npm run format ${allowed.join(" ")}`);
    }
    return commands;
  },
};

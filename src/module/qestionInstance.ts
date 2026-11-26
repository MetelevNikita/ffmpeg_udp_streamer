import inquirer from "inquirer";

export async function questionInstance<k extends string>(
  type: "input" | "checkbox" | "confirm",
  name: k,
  message: string,
): Promise<any> {
  if (type === "confirm") {
    const confirm = await inquirer.prompt({
      type: type,
      name: name,
      message: message,
      default: false,
    });

    return confirm;
  }

  if (type === "checkbox") {
    const check = await inquirer.prompt<Promise<Record<k, string>>>({
      type: type,
      name: name,
      message: message,
      choices: [
        { name: "yes", value: "yes" },
        { name: "no", value: "no" },
      ],
    });

    return check;
  }

  if (type === "input") {
    const answer = await inquirer.prompt<Promise<Record<k, string>>>([
      {
        type: type,
        name: name,
        message: message,
      },
    ]);

    return answer;
  }
}

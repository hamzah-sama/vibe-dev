import { Message } from "@/generated/prisma";
import { useEffect, useState } from "react";

interface Props {
  messages: Message[];
}

const textLoading = [
  "Thinking 🤔",
  "Still thinking...",
  "Searching my memory 🧠",
  "Gathering context 📚",
  "Consulting the data gods ☁️",
  "Analyzing your question 🔍",
  "Crunching the numbers 💻",
  "Almost done...",
  "Typing...",
];

export const MessageLoading = ({ messages }: Props) => {
  const lastMessageOfUser = messages.findLast(
    (message) => message.role === "USER"
  );

  const isLastMessageIsUser =
    lastMessageOfUser?.id === messages[messages.length - 1].id;

  const [index, setIndex] = useState(0);

  console.log(lastMessageOfUser?.id);
  console.log(messages[messages.length - 1].id);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLastMessageIsUser) {
        return;
      } else {
        setIndex((prevIndex) => (prevIndex + 1) % textLoading.length);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [messages.length, isLastMessageIsUser]);

  if (!!isLastMessageIsUser)
    return (
      <div className="text-sm text-muted-foreground pl-10 pb-7">
        {textLoading[index]}
      </div>
    );
};

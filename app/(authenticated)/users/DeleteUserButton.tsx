'use client';

import { Icons } from "@/libraries/icons";
import { Button } from "nelisoftware-react";
import { useTransition } from "react";
import { deleteUser } from "./actions";

type Props = {
  userId: string;
  userLabel: string;
};

export default function DeleteUserButton({ userId, userLabel }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!window.confirm(`Excluir o usuário "${userLabel}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    startTransition(async () => {
      try {
        await deleteUser(userId);
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Não foi possível excluir o usuário.");
      }
    });
  }

  return (
    <Button buttonColor="danger" type="button" disabled={isPending} onClick={handleClick}>
      <Icons.tabler.Trash size={18} />
      Excluir
    </Button>
  );
}

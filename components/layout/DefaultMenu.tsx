'use client';

import { Icons } from "@/libraries/icons";
import { Route } from "@/libraries/routes";
import { useSession } from "next-auth/react";
import DefaultItemMenu from "./DefaultItemMenu";
import DefaultSubMenu from "./DefaultSubMenu";

export function DefaultMenu() {
  const { data: session } = useSession();
  const iconProps = {
    size: 20,
    stroke: 1,
  }
  return (
    <>
      <DefaultItemMenu nameLink="Dashboard" href={Route.link.home} icon={<Icons.tabler.Home {...iconProps} />} />
      <DefaultItemMenu nameLink="Sequências" href={Route.link.sequencias} icon={<Icons.tabler.ChartBar {...iconProps} />} />
      <DefaultItemMenu nameLink="Linhas" href={Route.link.linhas} icon={<Icons.tabler.Rows {...iconProps} />} />
      <DefaultItemMenu nameLink="Ciclos" href={Route.link.cycles} icon={<Icons.tabler.Circles {...iconProps} />} />
      <DefaultItemMenu nameLink="Ciclos Não Marcar" href={Route.link.nocycles} icon={<Icons.tabler.InfinityOff {...iconProps} />} />
      <DefaultItemMenu nameLink="Duplas e Ternos" href={Route.link.duplasTernos} icon={<Icons.tabler.Grid {...iconProps} />} />
      <DefaultItemMenu nameLink="Últimos sorteios" href={Route.link.latestDraws} icon={<Icons.tabler.List {...iconProps} />} />
      <DefaultItemMenu nameLink="Conferir Cartão" href={Route.link.checkResults} icon={<Icons.tabler.Checkbox {...iconProps} />} />
      <DefaultItemMenu nameLink="Gerador de Jogos" href={Route.link.gerador} icon={<Icons.tabler.Dice {...iconProps} />} />
      <DefaultItemMenu nameLink="Backtest" href={Route.link.backtest} icon={<Icons.tabler.History {...iconProps} />} />
      {session?.user?.isAdmin && (
        <DefaultSubMenu nameLink="Configurações" icon={<Icons.tabler.Settings {...iconProps} />}>
          <DefaultItemMenu nameLink="Atualizar" href={Route.link.update} icon={<Icons.tabler.Refresh {...iconProps} />} />
          <DefaultItemMenu nameLink="Usuários" href={Route.link.users} icon={<Icons.tabler.User {...iconProps} />} />
        </DefaultSubMenu>
      )}
    </>
  );

}
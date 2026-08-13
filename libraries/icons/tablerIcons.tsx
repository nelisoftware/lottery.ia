import { Icon360, IconAdjustmentsHorizontal, IconAlertTriangle, IconArtboard, IconBrandGoogle, IconBrightnessUp, IconChartBar, IconCheck, IconCheckbox, IconChevronDown, IconChevronUp, IconCircles, IconClockPause, IconDice5, IconHistory, IconHome, IconInfinityOff, IconKey, IconLayoutGrid, IconLayoutNavbarExpand, IconLayoutRows, IconList, IconListCheck, IconLockOpen, IconLogout, IconMenu, IconMenu2, IconMoonFilled, IconNumbers, IconPlus, IconRefresh, IconRepeatOnce, IconSearch, IconSettings, IconTrash, IconUser, IconUsersPlus } from '@tabler/icons-react';

type Props = {
  size?: number,
  color?: string,
  stroke?: number,
  className?: string,
  xlinkTitle?: string,
}

export module TablerIcons {
  export const Add = (props: Props) => <IconPlus {...props} />
  export const ArtBoard = (props: Props) => <IconArtboard {...props} />
  export const AlertTriangle = (props: Props) => <IconAlertTriangle {...props} />

  export const CaretDown = (props: Props) => <IconChevronDown {...props} />
  export const CaretUp = (props: Props) => <IconChevronUp {...props} />
  export const ClockPause = (props: Props) => <IconClockPause {...props} />
  export const Circles = (props: Props) => <IconCircles {...props} />
  export const ChartBar = (props: Props) => <IconChartBar {...props} />
  export const Cycle = (props: Props) => <Icon360 {...props} />
  export const Dice = (props: Props) => <IconDice5 {...props} />
  export const History = (props: Props) => <IconHistory {...props} />
  export const Check = (props: Props) => <IconCheck {...props} />
  export const Checkbox = (props: Props) => <IconCheckbox {...props} />

  export const Expand = (props: Props) => <IconLayoutNavbarExpand {...props} />

  export const Filter = (props: Props) => <IconAdjustmentsHorizontal {...props} />

  export const Google = (props: Props) => <IconBrandGoogle {...props} />

  export const Grid = (props: Props) => <IconLayoutGrid {...props} />

  export const Home = (props: Props) => <IconHome {...props} />;

  export const InfinityOff = (props: Props) => <IconInfinityOff {...props} />
  
  export const Key = (props: Props) => <IconKey {...props} />

  export const Light = (props: Props) => <IconBrightnessUp {...props} />
  export const Logout = (props: Props) => <IconLogout {...props} />
  export const Login = (props: Props) => <IconLockOpen {...props} />
  export const List = (props: Props) => <IconList {...props} />
  export const ListCheck = (props: Props) => <IconListCheck {...props} />

  export const Rows = (props: Props) => <IconLayoutRows {...props} />

  export const Menu = (props: Props) => <IconMenu2 {...props} />;
  export const MenuMobile = (props: Props) => <IconMenu {...props} />;  

  export const Numbers = (props: Props) => <IconNumbers {...props} />
  export const Night = (props: Props) => <IconMoonFilled {...props} />

  export const Repeat = (props: Props) => <IconRepeatOnce {...props} />
  export const Refresh = (props: Props) => <IconRefresh {...props} />

  export const Search = (props: Props) => <IconSearch {...props} />
  export const Settings = (props: Props) => <IconSettings {...props} />
  export const Trash = (props: Props) => <IconTrash {...props} />

  export const UserPlus = (props: Props) => <IconUsersPlus {...props} />
  export const User = (props: Props) => <IconUser {...props} />
}

export type IconProps = Props;
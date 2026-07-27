type FooterProps = {
  children: React.ReactNode;
  position?: 'center' | 'start' | 'end';
}
const Positions = {
  'center': 'justify-center',
  'start': 'justify-start',
  'end': 'justify-end',
}

export default function Footer({ children, position = 'start' }: FooterProps) {
  const positions = Positions[position];
  return (
    <footer className={`flex w-full gap-2 px-2 py-1 bg-opacity-50 ${positions}`}>
      {children}
    </footer>
  );
}
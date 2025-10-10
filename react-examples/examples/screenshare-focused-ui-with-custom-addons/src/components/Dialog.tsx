import { RtkButton, RtkIcon, defaultIconPack } from '@cloudflare/realtimekit-react-ui';
import { FC, ReactNode } from 'react';

type DialogProps = {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  children: ReactNode;
};
const Dialog: FC<DialogProps> = ({ header, isOpen, children, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="RtkDialog" data-open={isOpen}>
      <div id="dialog">
        {/* <header>
          <h2>Effects</h2>
        </header> */}
        <RtkButton
          id="dismiss-btn"
          kind="icon"
          variant="ghost"
          onClick={() => onClose()}
        >
          <RtkIcon icon={defaultIconPack.dismiss} />
        </RtkButton>
        {children}
      </div>
    </div>
  );
};

export default Dialog;

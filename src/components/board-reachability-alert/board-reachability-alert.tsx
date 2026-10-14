import { useTranslation } from 'react-i18next';
import { useActiveAccountField } from '../../hooks/use-active-account-field';
import { useCommunityField } from '../../hooks/use-stable-community';
import { useNodeReachability } from '../../hooks/use-node-reachability';

// The desktop app always serves its RPC on this port, backed by the Kubo node the reachability check asks.
// Another local RPC port is a different node, whose reachability this check can't see.
const DESKTOP_RPC_PORT = '9138';

const isDesktopAppRpcUrl = (rpcUrl: string) => {
  try {
    const { hostname, port } = new URL(rpcUrl);
    return port === DESKTOP_RPC_PORT && (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]');
  } catch {
    return false;
  }
};

interface BoardReachabilityAlertProps {
  className: string;
  communityAddress?: string;
}

/** Tells the owner when browsers cannot load a board hosted by this desktop app, because its node is behind NAT. */
const BoardReachabilityAlert = ({ className, communityAddress }: BoardReachabilityAlertProps) => {
  const { t } = useTranslation();
  const rpcUrls = useActiveAccountField((account) => account?.pkcOptions?.pkcRpcClientsOptions as string[] | undefined);
  // The reachability check reads the app's own node, so it only applies when the account uses that node.
  const isUsingOwnNode = (rpcUrls ?? []).every(isDesktopAppRpcUrl);
  // pkc-js only exposes private settings to the node that hosts the board.
  const isHostedHere = useCommunityField(communityAddress, (community) => Boolean(community?.settings));
  const reachability = useNodeReachability(Boolean(isHostedHere) && isUsingOwnNode);

  if (reachability !== 'private') {
    return null;
  }

  return (
    <div className={className} role='status'>
      {t('board_unreachable_from_browsers')}
    </div>
  );
};

export default BoardReachabilityAlert;

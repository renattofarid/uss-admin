import { categoryMapper, getPostBySlug } from "@/services/posts";
import { RequestPost, getRequestPosts, ApprovalStatus, updateRequestStatus, MapApprovalStatus } from "@/services/request";
import { ActionsTypes } from "@/types/general";
import { formatDate } from "@/utils/date";
import { create } from "zustand";

interface TableRequests {
  [key: string | number]: string | number | JSX.Element;
  id: string;
  title: string | JSX.Element;
  category: string;
  user: string | JSX.Element;
  status: string;
  createdAt: string;
}
type State = {
  requests: RequestPost[];
  tableRequests: TableRequests[];
  requestSelected: RequestPost | null;
  action: ActionsTypes;
  loading: boolean;
  open: boolean;
};

type Actions = {
  getData: () => Promise<void>;
  setRequestSelected: (id: string, action: ActionsTypes) => Promise<void>;
  updRequestStatus: (id: string, status: ApprovalStatus, rejectionReason?: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setOpen: (open: boolean) => void;
};

const mapRequestsToTableRequests = (requests: RequestPost[]): TableRequests[] => {
  return requests.map((request) => ({
    title: (
      <div className="flex flex-row gap-2">
        <img
          className="w-12 h-12 rounded-lg object-cover"
          src={
            request.imageUrl ||
            "https://avatars.githubusercontent.com/u/93000567"
          }
          alt={request.title}
        />
        <span className="text-xs font-semibold">{request.title}</span>
      </div>
    ),
    id: request.id,
    category: categoryMapper[request.category],
    user: (
      <div className="flex flex-col gap-0">
        {request.user && (
          <>
            <span className="text-xs font-semibold">{request.user.name}</span>
            <span className="text-xs font-light">{request.user.email}</span>
          </>
        )}

      </div>
    ),
    createdAt: formatDate(request.createdAt.toString()),
    status: request.approvalStatus ? MapApprovalStatus[request.approvalStatus] : 'Pendiente',
    slug: request.slug,
  }));
}

export const RequestStore = create<State & Actions>((set) => ({
  requests: [],
  tableRequests: [],
  requestSelected: null,
  action: 'none',
  loading: false,
  open: false,
  getData: async () => {
    try {
      set({ loading: true });
      const requests = await getRequestPosts();
      set({ requests });
      const tableRequests = mapRequestsToTableRequests(requests);
      set({ tableRequests });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente");
    } finally {
      set({ loading: false });
    }
  },
  async setRequestSelected(id, action) {
    console.log({id})
    if (!id) return;
    if (action === 'view') {
      console.log({ id });
      const requestSelected = await getPostBySlug(id);
      set({ requestSelected: requestSelected as unknown as RequestPost, action, open: !!id });
      return
    }
    const requestSelected = RequestStore.getState().requests.find((Request) => Request.id === id);
    set({ requestSelected, action, open: !!id });
  },
  updRequestStatus: async (id, approvalStatus, rejectionReason) => {
    try {
      set({ loading: true });
      const updatedRequest = await updateRequestStatus(id, { approvalStatus, rejectionReason });
      const updatedRequests = RequestStore.getState().requests.map((request) => {
        if (request.id === id) {
          return updatedRequest;
        }
        return request;
      });
      set({ requests: updatedRequests });
      set({ tableRequests: mapRequestsToTableRequests(updatedRequests) });
      set({ open: false });
    } catch (error) {
      console.error("Ocurrió un error inesperado, intente nuevamente", error);
    } finally {
      set({ loading: false });
    }
  },
  setLoading: (loading) => set({ loading }),
  setOpen: (open) => set({ open }),
}));

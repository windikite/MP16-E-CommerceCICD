import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePost } from "./queries";

export function useDeletePost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePost,
        onSuccess: (data) => {
            queryClient.invalidateQueries({queryKey: ['posts']})
            console.log('Post deleted successfully')
        }
    })
}
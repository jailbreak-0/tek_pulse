export type Post = {
    id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    user_id: string;
    profiles: {
      full_name: string;
      avatar_url?: string;
    };
    likes?: {
      user_id: string;
    }[];
    shares?: {
      user_id: string;
    }[];
  };
  
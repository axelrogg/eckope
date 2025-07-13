import { EcoAuthor } from "./eco-author";
import { EcoControls } from "./eco-controls";

export const EcoReply = ({ author, content, upvotes, downvotes }: EcoReply) => (
    <div className="my-3 flex flex-col space-y-2">
        <EcoAuthor fullName={author.fullName} username={author.handle} />
        <span className="text-sm">{content}</span>
        <EcoControls upvotes={upvotes} downvotes={downvotes} />
    </div>
);

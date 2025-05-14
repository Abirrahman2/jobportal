import { IsString,IsIn} from "class-validator";

export class UpdateStatusDto{
    @IsString()
    @IsIn(['published','not published'],{message :'put value published or not published'})
    status:string;

        
}
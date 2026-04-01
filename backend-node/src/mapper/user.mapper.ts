import { UserResponse } from "../dto/user.dto";
import { users } from "../schema/users";

type UserEntity = typeof users.$inferSelect;

export class UserMapper {

    static toResponse(entity: UserEntity): UserResponse {
        return {
            id: entity.id,
            username: entity.username,
            nome: entity.nome,
            email: entity.email ?? "",
            role: entity.role,
            enabled: entity.enabled,
        };
    }

}

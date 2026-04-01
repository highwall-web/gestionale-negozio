import { ColorResponse } from "../dto/color.dto";
import { colors } from "../schema/colors";

type ColorEntity = typeof colors.$inferSelect;

export class ColorMapper {

    static toResponse(entity: ColorEntity): ColorResponse {
        return {
            id: entity.id,
            nome: entity.nome,
        };
    }

}

import { EntityUtilities } from '../../utilities/entity.utilities';
import { baseProperty } from '../base/base-property.decorator';
import { DecoratorTypes } from '../base/decorator-types.enum';
import { DefaultFileDecoratorConfigInternal, ImageFileDecoratorConfigInternal } from './file-decorator-internal.data';
import { DefaultFileDecoratorConfig, ImageFileDecoratorConfig } from './file-decorator.data';

/**
 * Decorator for setting and getting file property metadata.
 *
 * @param metadata - The metadata of the file property.
 * @returns The method that defines the metadata.
 * @throws When an unknown metadata type was provided.
 */
export function file(metadata: DefaultFileDecoratorConfig | ImageFileDecoratorConfig): (target: object, propertyKey: string) => void {
    switch (metadata.type) {
        case 'other':
            return baseProperty(
                new DefaultFileDecoratorConfigInternal(metadata),
                DecoratorTypes.FILE_DEFAULT,
                [EntityUtilities.FILENAMES_KEY]
            );
        case 'image':
            return baseProperty(
                new ImageFileDecoratorConfigInternal(metadata),
                DecoratorTypes.FILE_IMAGE,
                [EntityUtilities.FILENAMES_KEY, EntityUtilities.MULTI_PREVIEW_IMAGES_KEY, EntityUtilities.SINGLE_PREVIEW_IMAGE_KEY]
            );
        default:
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
            throw new Error(`Unknown metadata type ${(metadata as any).type}`);
    }
}
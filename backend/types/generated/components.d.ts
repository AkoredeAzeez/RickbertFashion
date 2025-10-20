import type { Schema, Struct } from '@strapi/strapi';

export interface SharedAddress extends Struct.ComponentSchema {
  collectionName: 'components_shared_addresses';
  info: {
    displayName: 'Address';
    icon: 'pinMap';
  };
  attributes: {
    city: Schema.Attribute.String;
    state: Schema.Attribute.String;
    street: Schema.Attribute.String;
    zip: Schema.Attribute.String;
  };
}

export interface ShopOrderItem extends Struct.ComponentSchema {
  collectionName: 'components_shop_order_items';
  info: {
    displayName: 'Order Item';
    icon: 'gift';
  };
  attributes: {
    product: Schema.Attribute.Relation<'oneToOne', 'api::product.product'>;
    quantity: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.address': SharedAddress;
      'shop.order-item': ShopOrderItem;
    }
  }
}

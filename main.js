let eventBus = new Vue();

// Product Details Component
Vue.component('product-details',{
    props:{
        details:{
            type: Array,
            required: true
        }
    },
    template: `<ul>
        <li v-for="detail in details">
        {{detail}}
        </li>
    </ul>`
});

// Product Component
Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `<div class="flex">
            <div class="product-image">
                <!-- :src adalah bentuk shorthand dari v-bind:src -->
                <!-- v-bind digunakan untuk memasukan data ke dalam atribute dengan vue -->
                <img :src="image">
            </div>
            <div class="product-info">
                <h1>
                    {{ title }}
                    <span v-if="onSale">On Sale!</span>
                </h1>
                <!-- Conditional Rendering dengan vue directive-->
                <!-- Ini -->
                <!-- Kondisi pertama jika inventory lebih besar dari 10 -->
                <p v-if="inventory>10" class="success">In Stock</p>
                <!-- Kondisi kedua jika inventory lebih besar sama dengan 10 dan inventory lebih besar dari 0 -->
                <p v-else-if="inventory<=10 && inventory>0" class=" warning">Almost sold out</p>
                <!-- Kondisi terakhir jika kondisi pertama dan kedua tidak terpenuhi -->
                <p v-else="inventory" class="false" :class="{'line-through': !inStock}">Out of Stock</p>
                <p class="description">{{ description }}</p>
                <p>Shipping : {{ shipping }}</p>
                <!-- List Rendering -->
                <product-details :details="details"></product-details>

                <div class="flex color">
                    <div v-for="(variant, index) in variants" :key="variant.variantId" class="margin-left">
                        <div :class="variant.variantColor" @click="updateProduct(index)"></div>
                    </div>
                </div>

                <div class="sizes flex margin-top">
                    <div v-for="size of sizes">
                        <input class="checkbox-size" type="radio" name="sizes" :id="size">
                        <label class="for-checkbox-size" :for="size">
                            {{size}}
                        </label>
                    </div>
                </div>

                <button @click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart</button>
                <button @click="removeFromCart" class="btn-remove">Remove from cart</button>

                <product-tabs class="margin-top" :reviews="reviews"></product-tabs>

                <div class="product-info-footer margin-top">
                    <a :href="link" target="_blank">
                        See more product like this
                    </a>
                </div>
            </div>
        </div>`,
    data() {
        return {
            /* property data digunakan untuk mengirim data ke DOM */
            brand: 'Vue Mastery',
            product: 'Socks',
            description: 'Made with love that makes you feel warm when you use it',
            selectedVariant: 0,
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender natural'],
            variants: [{
                    variantId: '2234',
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    quantity: 15
                },
                {
                    variantId: '2235',
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    quantity: 3
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL'],
            reviews: []
        };
    },
    methods: {
        addToCart() {
            if (this.variants[this.selectedVariant].quantity > 0) {
                this.variants[this.selectedVariant].quantity -= 1;
                this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
            }
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        }
    },
    computed: {
        title() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity;
        },
        inventory() {
            return this.variants[this.selectedVariant].quantity;
        },
        shipping() {
            if (this.premium) {
                return 'Free';
            }
            return 2.99
        }
    },
    mounted(){
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
        })
    }
})

// Tabs Component
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: true
        }
    },
    template:  `
        <div>
            <span class="tab" :class="{activeTab: selectedTab == tab}" v-for="(tab,index) of tabs" :key="index" @click="selectedTab = tab">
            {{tab}}
            </span>

            <div class="margin-top" v-show="selectedTab === 'Reviews'">
                    <h2>Reviews</h2>
                    <p v-if="!reviews.length">There are no reviews</p>
                    <ul>
                        <li v-for="review in reviews">
                        <p>{{review.name}}</p>
                        <p>{{review.review}}</p>
                        <p>Rating {{review.rating}}</p>
                        </li>
                    </ul>
            </div>
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
    data(){
        return {
            tabs: ['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
});

// Product Review Component
Vue.component('product-review',{
    template: `
        <form class="review-form" @submit.prevent="onSubmit">
            <div class="validation" v-if="errors.length">
                Please correct the following error(s).
                <ul>
                    <li v-for="error of errors">{{error}}</li>
                </ul>
            </div>

            <div class="form-group">
                <label for="name">Name :</label>
                <input type="text" v-model="name" id="name">
            </div>
            <div class="form-group">
                <label for="review">Review :</label>
                <textarea v-model="review" id="review">
                </textarea>
            </div>
            <div class="form-group">
                <label for="rating">Rating :</label>
                <select v-model="rating" id="rating">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </select>
            </div>
            <div><input type="submit" value="Save"></div>
        </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors : []
        }
    },
    methods: {
        onSubmit(){
            this.errors = [];
            if(this.name && this.review && this.rating){
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                };
                eventBus.$emit('review-submitted', productReview);
                this.name = null;
                this.rating = null;
                this.review = null;
            }else{
                if(!this.name) this.errors.push('The field name is required.');
                if(!this.review) this.errors.push('The field review is required.');
                if(!this.rating) this.errors.push('The field rating is required.');
            }
        }
    }
})

// Membuat vue instance
var app = new Vue({
    el: '#app' /*select element root*/ ,
    data: {
        premium: false,
        cart: []
    },
    methods: {
        updateCart(id){
            this.cart.push(id);
        },
        removeItem(id){
            const cartLength = this.cart.length;
            if(cartLength > 0){
                for(let i = cartLength;i>=0;i--){
                    if(this.cart[i] === id){
                        this.cart.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
})
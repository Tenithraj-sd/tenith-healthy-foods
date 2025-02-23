import asyncio
import os
import json
from aiogram import Bot, Dispatcher, types
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.fsm.storage.memory import MemoryStorage
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
BOT_TOKEN = os.getenv("BOT_TOKEN")

# Initialize bot and dispatcher
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher(storage=MemoryStorage())

# Load product data from JSON
with open("products.json", "r", encoding="utf-8") as f:
    product_data = json.load(f)

async def delete_messages_later(user_id: int, message_ids: list, delay: int = 100):
    """Deletes messages after a delay and sends a restart prompt."""
    await asyncio.sleep(delay)
    for msg_id in message_ids:
        try:
            await bot.delete_message(chat_id=user_id, message_id=msg_id)
        except:
            pass  # Ignore errors if message was already deleted
    await bot.send_message(user_id, "⌛ *To restart, click* /start", parse_mode="Markdown")

@dp.message(Command("start"))
async def start_menu(message: types.Message):
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text=f"🍛 {category}", callback_data=f"category_{category}")] for category in product_data
    ] + [[InlineKeyboardButton(text="📞 Contact", callback_data="contact")]])

    sent_message = await message.answer("📌 *Welcome to Tenith Healthy Foods!* \n\nSelect a category:", 
                                        parse_mode="Markdown", reply_markup=keyboard)
    asyncio.create_task(delete_messages_later(message.chat.id, [message.message_id, sent_message.message_id]))

@dp.callback_query(lambda c: c.data.startswith("category_"))
async def show_products(callback: types.CallbackQuery):
    category = callback.data.split("_", 1)[1]

    product_buttons = [
        [InlineKeyboardButton(text=prod, callback_data=f"product_{category}_{prod}")]
        for prod in product_data[category]["products"]
    ]
    product_buttons.append([InlineKeyboardButton(text="🔙 Back", callback_data="start")])
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=product_buttons)

    await callback.message.delete()
    await callback.message.answer(f"📌 *{category}* \n\nSelect a product:", parse_mode="Markdown", reply_markup=keyboard)

@dp.callback_query(lambda c: c.data.startswith("product_"))
async def product_details(callback: types.CallbackQuery):
    _, category, product = callback.data.split("_", 2)
    product_info = product_data[category]["products"][product]

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="❓ What?", callback_data=f"info_{category}_{product}_what")],
        [InlineKeyboardButton(text="💡 Benefits", callback_data=f"info_{category}_{product}_benefits")],
        [InlineKeyboardButton(text="🍽 How to Use", callback_data=f"info_{category}_{product}_use")],
        [InlineKeyboardButton(text="🏠 Main", callback_data="start"), InlineKeyboardButton(text="🔙 Back", callback_data=f"category_{category}")]
    ])

    await callback.message.delete()
    await callback.message.answer(
        f"⭐ *{product}*\n\n💰 {product_info['price']}\n🧴 Bottle Packaging: {product_info['bottle_packaging']}",
        parse_mode="Markdown", reply_markup=keyboard
    )

@dp.callback_query(lambda c: c.data.startswith("info_"))
async def product_info(callback: types.CallbackQuery):
    _, category, product, info_type = callback.data.split("_", 3)
    product_info = product_data[category]["products"][product]

    info_text = {
        "what": f"📌 *What is {product}?* \n\n{product_info['what']}",
        "benefits": f"💡 *Benefits of {product}* \n\n{product_info['benefits']}",
        "use": f"🍽 *How to Use {product}* \n\n{product_info['use']}"
    }

    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🏠 Main", callback_data="start"), InlineKeyboardButton(text="🔙 Back", callback_data=f"product_{category}_{product}")]
    ])

    await callback.message.delete()
    await callback.message.answer(info_text[info_type], parse_mode="Markdown", reply_markup=keyboard)

@dp.callback_query(lambda c: c.data == "contact")
async def contact_info(callback: types.CallbackQuery):
    contact_text = ("📍 *TENITH HEALTHY FOODS* \n\n"
                    "🏠 *Address:* \n136, வண்ணியார் நகர், மெய்யனூர், சேலம், தமிழ்நாடு - 636004 \n\n"
                    "📞 *Phone:* 9488710427 \n"
                    "📩 *Email:* tenithhealthyfoods@gmail.com \n\n"
                    "🌐 *Website:* [Visit Website](https://tenith-healthy.netlify.app) \n"
                    "📷 *Instagram:* [@tenithhealthyfoods](https://instagram.com/tenithhealthyfoods)")

    keyboard = InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="🔙 Back", callback_data="start")]])

    await callback.message.delete()
    await callback.message.answer(contact_text, parse_mode="Markdown", reply_markup=keyboard)

@dp.callback_query(lambda c: c.data == "start")
async def back_to_start(callback: types.CallbackQuery):
    await callback.message.delete()
    await start_menu(callback.message)

async def main():
    print("🤖 Bot is running...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())

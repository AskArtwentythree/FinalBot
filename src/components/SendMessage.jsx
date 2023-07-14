import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react"
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { getDatabase } from "firebase/database";


const SendMessage = () => {
  const [value, setValue] = useState("");
  const { currentUser } = UserAuth();


  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (value.trim() === "") {
      alert("Enter valid message!");
      return;
    }

    try {
      const { uid, displayName } = currentUser;
      await addDoc(collection(db, "messages"), {
        text: value,
        name: displayName,
        createdAt: serverTimestamp(),
        uid
      })
    } catch (error) {
      console.log(error);
    }
    setValue("");
    /// Отправка вопроса и id-пользователя из фронта на фаст апи серв: ///

    async function sendQuestion(uid, question) {
      const response = await fetch('http://localhost:8000/receive_question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: uid,
          question: question
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    }


    /// Пример использования функции: ///

    try {
      const response = await sendQuestion(uid, "What is the functionality of your app ?")
      console.log(response);
    } catch (error) {
      console.log(error);
    }



    /// Получение volunteer_answer из фаст апи серва для фронта (случай если вопрос является FAQ и ответ сразу же выведется): ///

    async function getAnswer(uid) {
      const response = await fetch('http://localhost:8000/send_answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: uid
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const volunteerAnswer = data.volunteer_answer;
      return volunteerAnswer;
    }

  }

  return (
    <div className="bg-gray-200 fixed bottom-0 w-full py-10 shadow-lg">
      <form onSubmit={handleSendMessage} className="px-2 containerWrap flex">
        <input value={value} onChange={e => setValue(e.target.value)} className="input w-full focus:outline-none bg-gray-100 rounded-r-none" type="text" />
        <button type="submit" className="w-auto bg-gray-500 text-white rounded-r-lg px-5 text-sm">Send</button>
      </form>
    </div>
  )
}

export default SendMessage